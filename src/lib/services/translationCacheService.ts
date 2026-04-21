/**
 * Two-level translation cache:
 *   L1 — localStorage  (instant, survives page reload)
 *   L2 — Firestore     (shared across devices, persists forever)
 *
 * Flow:
 *   1. Check L1 (localStorage)  → return immediately if found
 *   2. Check L2 (Firestore)     → save to L1 and return if found
 *   3. Call translation API     → save to both L1 and L2, return result
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const LS_PREFIX = 'tr_cache_';
const FIRESTORE_COLLECTION = 'translation_cache';

export interface CachedTranslation {
  name: string;
  description: string;
  lang: string;
  cachedAt: number;
}

// ── L1: localStorage ──────────────────────────────────────────────────────

function lsKey(productId: string, lang: string) {
  return `${LS_PREFIX}${productId}_${lang}`;
}

function lsGet(productId: string, lang: string): CachedTranslation | null {
  try {
    const raw = localStorage.getItem(lsKey(productId, lang));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function lsSet(productId: string, lang: string, data: CachedTranslation) {
  try {
    localStorage.setItem(lsKey(productId, lang), JSON.stringify(data));
  } catch {
    // localStorage full — ignore
  }
}

// ── L2: Firestore ─────────────────────────────────────────────────────────

async function fsGet(productId: string, lang: string): Promise<CachedTranslation | null> {
  try {
    const ref = doc(db, FIRESTORE_COLLECTION, `${productId}_${lang}`);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as CachedTranslation) : null;
  } catch {
    return null;
  }
}

async function fsSet(productId: string, lang: string, data: CachedTranslation) {
  try {
    const ref = doc(db, FIRESTORE_COLLECTION, `${productId}_${lang}`);
    await setDoc(ref, data);
  } catch {
    // Firestore write failed — not critical
  }
}

// ── Public API ────────────────────────────────────────────────────────────

export const translationCacheService = {
  /**
   * Get cached translation. Returns null if not cached anywhere.
   * Automatically promotes L2 hit to L1.
   */
  async get(productId: string, lang: string): Promise<CachedTranslation | null> {
    // L1 hit
    const l1 = lsGet(productId, lang);
    if (l1) return l1;

    // L2 hit
    const l2 = await fsGet(productId, lang);
    if (l2) {
      lsSet(productId, lang, l2); // promote to L1
      return l2;
    }

    return null;
  },

  /**
   * Save translation to both L1 and L2.
   */
  async set(productId: string, lang: string, name: string, description: string) {
    const data: CachedTranslation = { name, description, lang, cachedAt: Date.now() };
    lsSet(productId, lang, data);
    await fsSet(productId, lang, data); // fire-and-forget is fine
  },

  /**
   * Check L1 only (synchronous, no network).
   */
  getSync(productId: string, lang: string): CachedTranslation | null {
    return lsGet(productId, lang);
  },

  /**
   * Clear all cached translations from localStorage.
   */
  clearLocal() {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(LS_PREFIX))
        .forEach(k => localStorage.removeItem(k));
    } catch {}
  },
};

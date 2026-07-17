/**
 * Centralized API configuration for CityNerve.
 *
 * Priority:
 *   1. NEXT_PUBLIC_API_BASE_URL env var (set in Vercel / .env.local)
 *   2. http://127.0.0.1:8000 in local development
 *   3. Empty string '' in production when no URL is set → all fetch() calls
 *      will fail immediately → each hook falls back to local demo data.
 *
 * We intentionally NEVER throw here. Throwing at module-evaluation time would
 * crash every hook that imports this file before any fallback can run.
 */

const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_BASE_URL: string =
  envUrl
    ? envUrl.replace(/\/$/, '')           // Use configured URL (strip trailing slash)
    : process.env.NODE_ENV === 'production'
      ? ''                                // Production, no URL → demo mode fallback
      : 'http://127.0.0.1:8000';         // Local dev default

/** True when there is no backend URL configured (pure demo / offline mode). */
export const IS_API_UNCONFIGURED = API_BASE_URL === '';

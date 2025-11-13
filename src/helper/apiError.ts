// src/lib/apiError.ts

export interface ApiError extends Error {
  status?: number;
  details?: unknown;
}

type StatusMessageMap = Record<number, string>;

/**
 * Utility buat bikin Error yang konsisten dari Response + body JSON.
 */
export function createApiError(
  res: Response,
  data: any,
  customMessages: StatusMessageMap = {}
): ApiError {
  const status = res.status;

  const fallbackByStatus =
    customMessages[status] ||
    data?.message ||
    data?.error ||
    (status === 401
      ? "Sesi berakhir. Silakan login ulang."
      : status === 409
      ? "Terjadi konflik data."
      : status >= 500
      ? "Server error."
      : `Request gagal (${status})`);

  const err = new Error(fallbackByStatus) as ApiError;
  err.status = status;
  err.details = data;
  return err;
}

/**
 * Helper umum: parse JSON (kalau bisa), lempar ApiError kalau !ok, return data kalau ok.
 */
export async function handleJsonResponse<T>(
  res: Response,
  customMessages: StatusMessageMap = {}
): Promise<T> {
  const data = await res
    .json()
    .catch(() => ({} as unknown)); // kalau bukan JSON, biarin kosong

  if (!res.ok) {
    throw createApiError(res, data, customMessages);
  }

  return data as T;
}

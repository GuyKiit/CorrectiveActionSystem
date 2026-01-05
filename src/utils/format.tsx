// ===== helper: format string bf compare =====
export const norm = (v: unknown) => String(v ?? "").trim().toLowerCase();


export const same = (a?: string | number | null, b?: string | number | null) =>
  String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase();

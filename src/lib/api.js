const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export const syncEnabled = Boolean(BASE_URL);

export async function fetchBoard(code) {
  if (!BASE_URL) return null;
  const res = await fetch(`${BASE_URL}/api/board/${encodeURIComponent(code)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const json = await res.json();
  return json.data;
}

export async function saveBoard(code, data) {
  if (!BASE_URL) return null;
  const res = await fetch(`${BASE_URL}/api/board/${encodeURIComponent(code)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Save failed: ${res.status}`);
  const json = await res.json();
  return json.data;
}

export function generateSyncCode() {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no ambiguous chars (0/O, 1/I/L)
  let code = "";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  for (let i = 0; i < 6; i++) code += alphabet[bytes[i] % alphabet.length];
  return code;
}

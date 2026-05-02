/** In-memory access JWT only (never persist). */
let memoryAccessToken: string | null = null

export function setAccessToken(token: string | null) {
  memoryAccessToken = token
}

export function getAccessToken() {
  return memoryAccessToken
}

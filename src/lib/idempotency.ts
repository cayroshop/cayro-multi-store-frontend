/** Backend requires `Idempotency-Key` (min 8 chars) on selected mutations (e.g. create store). */
export function createIdempotencyKey(): string {
  return crypto.randomUUID()
}

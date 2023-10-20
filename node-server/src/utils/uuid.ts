/**
 * Generates a version 4 UUID (Universally Unique Identifier).
 *
 * A UUID v4 is based on random numbers. This function adheres to RFC4122,
 * setting the version bits to 0100 in time-high-and-version field,
 * and bits 6 and 7 in the clock-seq-and-reserved field to 01.
 *
 * @returns {string} A version 4 UUID string representation.
 */
export function uuidV4() {
  const uuid = new Array(36)
  for (let i = 0; i < 36; i++) {
    uuid[i] = Math.floor(Math.random() * 16)
  }
  // Set version to 4 (bits 12-15 of time-high-and-version to 0100)
  uuid[14] = 4

  // Set bit 6 of clock-seq-and-reserved to zero
  uuid[19] = uuid[19] &= ~(1 << 2)

  // Set bit 7 of clock-seq-and-reserved to one
  uuid[19] = uuid[19] |= 1 << 3

  // Insert hyphen (-) characters as per UUID format
  uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'

  // Convert the UUID components to hexadecimal format and join them
  return uuid.map((x) => x.toString(16)).join('')
}

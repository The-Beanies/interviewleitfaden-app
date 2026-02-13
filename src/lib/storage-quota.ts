export function getLocalStorageUsage(): { usedBytes: number; usagePercent: number } {
  let totalBytes = 0
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key) ?? ''
        totalBytes += (key.length + value.length) * 2 // UTF-16
      }
    }
  } catch {
    // localStorage may not be available
  }
  const maxBytes = 5 * 1024 * 1024 // 5MB typical limit
  return { usedBytes: totalBytes, usagePercent: Math.round((totalBytes / maxBytes) * 100) }
}

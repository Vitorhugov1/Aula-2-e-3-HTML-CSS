const INSTAGRAM_HOSTS = new Set(['instagram.com', 'www.instagram.com'])
const FACEBOOK_HOSTS = new Set(['facebook.com', 'www.facebook.com', 'm.facebook.com'])

export function detectImageType(bytes) {
  if (!(bytes instanceof Uint8Array)) return null

  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { mime: 'image/jpeg', extension: 'jpg' }
  }

  if (
    bytes.length >= 8
    && bytes[0] === 0x89
    && bytes[1] === 0x50
    && bytes[2] === 0x4e
    && bytes[3] === 0x47
    && bytes[4] === 0x0d
    && bytes[5] === 0x0a
    && bytes[6] === 0x1a
    && bytes[7] === 0x0a
  ) {
    return { mime: 'image/png', extension: 'png' }
  }

  const ascii = (start, end) => String.fromCharCode(...bytes.slice(start, end))
  if (bytes.length >= 12 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') {
    return { mime: 'image/webp', extension: 'webp' }
  }

  return null
}

export function isSafeSocialUrl(value, network) {
  if (!value) return true
  try {
    const url = new URL(value)
    const allowedHosts = network === 'instagram' ? INSTAGRAM_HOSTS : FACEBOOK_HOSTS
    return url.protocol === 'https:'
      && !url.username
      && !url.password
      && !url.port
      && allowedHosts.has(url.hostname.toLowerCase())
  } catch {
    return false
  }
}

export function isStrongAdminPassword(value) {
  return typeof value === 'string'
    && value.length >= 12
    && value.length <= 128
    && /[a-z]/.test(value)
    && /[A-Z]/.test(value)
    && /\d/.test(value)
    && /[^A-Za-z0-9]/.test(value)
}

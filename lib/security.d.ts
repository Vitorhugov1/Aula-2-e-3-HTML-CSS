export type DetectedImageType = { mime: 'image/jpeg' | 'image/png' | 'image/webp'; extension: 'jpg' | 'png' | 'webp' }

export function detectImageType(bytes: Uint8Array): DetectedImageType | null
export function isSafeSocialUrl(value: string, network: 'instagram' | 'facebook'): boolean
export function isStrongAdminPassword(value: string): boolean

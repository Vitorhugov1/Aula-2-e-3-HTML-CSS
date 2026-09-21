export function onlyDigits(value) {
  return String(value ?? '').replace(/\D/g, '')
}

export function normalizeBrazilianWhatsApp(value) {
  let digits = onlyDigits(value)
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`
  return /^55[1-9]{2}[2-9]\d{7,8}$/.test(digits) ? digits : null
}

export function formatBrazilianPhone(value) {
  const digits = onlyDigits(value).replace(/^55(?=\d{10,11}$)/, '')
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return value || ''
}

export function whatsappUrl(number, message = '') {
  const digits = onlyDigits(number)
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}

export function isSafeHttpUrl(value) {
  if (!value) return true
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

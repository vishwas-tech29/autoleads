export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '')
  
  // Add country code if not present
  if (cleaned.length === 10) {
    return `91${cleaned}`
  }
  
  return cleaned
}

export function validateIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  
  // Check if it's a valid Indian mobile number
  if (cleaned.length === 10) {
    return /^[6-9]\d{9}$/.test(cleaned)
  }
  
  if (cleaned.length === 12) {
    return /^91[6-9]\d{9}$/.test(cleaned)
  }
  
  return false
}

export function formatTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
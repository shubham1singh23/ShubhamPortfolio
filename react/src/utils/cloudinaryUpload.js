const DEFAULT_CLOUDINARY_CLOUD = 'dh9nlw5gq'
const DEFAULT_UPLOAD_PRESET = 'portfolio'

export function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') {
    return ''
  }

  let normalized = url.trim()
  if (!normalized) {
    return ''
  }

  if (normalized.startsWith('http://')) {
    normalized = `https://${normalized.slice('http://'.length)}`
  }

  if (normalized.includes('res.cloudinary.com') && normalized.includes('/upload/')) {
    normalized = normalized.replace(/\/upload\/(?!f_auto,q_auto\/)/, '/upload/f_auto,q_auto/')
  }

  try {
    return new URL(normalized).toString()
  } catch {
    return encodeURI(normalized)
  }
}

export async function uploadToCloudinary(file) {
  if (!file) {
    return { success: false, reason: 'missing_file' }
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || DEFAULT_CLOUDINARY_CLOUD
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || DEFAULT_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    return { success: false, reason: 'missing_env' }
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
  const body = new FormData()
  body.append('file', file)
  body.append('upload_preset', uploadPreset)

  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body
    })

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}))
      return { success: false, reason: errorPayload?.error?.message || response.statusText }
    }

    const result = await response.json()
    return {
      success: true,
      url: normalizeImageUrl(result.secure_url)
    }
  } catch (error) {
    return {
      success: false,
      reason: error?.message || 'upload_failed'
    }
  }
}

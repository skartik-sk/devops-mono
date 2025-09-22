// API Configuration for different environments
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://linkvault.skartik.xyz'
    : 'http://localhost:8080')

export const API_ENDPOINTS = {
  links: `${API_BASE_URL}/api/links`,
  users: `${API_BASE_URL}/api/users`,
  collections: `${API_BASE_URL}/api/collections`,
  publicLinks: `${API_BASE_URL}/api/public/links`,
} as const

export function getApiUrl(endpoint: keyof typeof API_ENDPOINTS, id?: string): string {
  if (id) {
    return `${API_ENDPOINTS[endpoint]}/${id}`
  }
  return API_ENDPOINTS[endpoint]
}

export function getUserApiUrl(userId: string, endpoint: 'saved-links'): string {
  return `${API_ENDPOINTS.users}/${userId}/${endpoint}`
}
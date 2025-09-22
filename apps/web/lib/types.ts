export interface Link {
  id: number
  title: string
  url: string
  description?: string
  tags?: string[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
  collectionId?: number
  collection?: {
    id: number
    name: string
    description?: string
    color: string
    isPublic: boolean
    createdAt: string
    updatedAt: string
  }
}
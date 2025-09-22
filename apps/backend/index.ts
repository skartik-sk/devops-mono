import { prisma } from 'db/client'

interface LinkData {
  title: string
  url: string
  description?: string
  tags?: string[]
  collectionId?: number
  isPublic?: boolean
}

interface CollectionData {
  name: string
  description?: string
  color?: string
  isPublic?: boolean
}

interface UserData {
  name: string
  email?: string
  bio?: string
  isPublic?: boolean
}

const server = Bun.serve({
  port: 8080,
  fetch: async (req) => {
    const url = new URL(req.url)
    const method = req.method

    // Add CORS headers to all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    }

    // Handle preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    // Helper function to create responses with CORS headers
    function createResponse(data: any, status: number = 200, headers: Record<string, string> = {}) {
      return new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', ...headers }
      })
    }

    function createTextResponse(text: string, status: number = 200, headers: Record<string, string> = {}) {
      return new Response(text, {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain', ...headers }
      })
    }

    // Health check
    if (url.pathname === '/') {
      return createTextResponse('LinkVault API Server is running!')
    }

    // Links API endpoints
    if (url.pathname === '/api/links') {
      try {
        if (method === 'GET') {
          const search = url.searchParams.get('search') || ''

          let whereClause = {}
          if (search) {
            whereClause = {
              OR: [
                { title: { contains: search, mode: 'insensitive' as const } },
                { description: { contains: search, mode: 'insensitive' as const } },
                { tags: { has: search } }
              ]
            }
          }

          const links = await prisma.link.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
          })

          return createResponse(links)
        }

        if (method === 'POST') {
          const body = await req.json() as LinkData
          const { title, url: linkUrl, description, tags = [], isPublic = false, collectionId } = body

          if (!title || !linkUrl) {
            return createTextResponse('Title and URL are required', 400)
          }

          const newLink = await prisma.link.create({
            data: {
              title,
              url: linkUrl,
              description,
              tags,
              isPublic,
              collectionId,
              updatedAt: new Date()
            }
          })

          return createResponse(newLink, 201)
        }
      } catch (error) {
        console.error('Error with /api/links:', error)
        return createTextResponse('Internal Server Error', 500)
      }
    }

    // Collections API endpoints
    if (url.pathname === '/api/collections') {
      try {
        if (method === 'GET') {
          const collections = await prisma.collection.findMany({
            include: {
              _count: {
                select: { links: true }
              }
            },
            orderBy: { createdAt: 'desc' }
          })

          return createResponse(collections)
        }

        if (method === 'POST') {
          const body = await req.json() as CollectionData
          const { name, description, color = 'bg-blue-500', isPublic = false } = body

          if (!name) {
            return createTextResponse('Name is required', 400)
          }

          const newCollection = await prisma.collection.create({
            data: {
              name,
              description,
              color,
              isPublic,
              updatedAt: new Date()
            }
          })

          return createResponse(newCollection, 201)
        }
      } catch (error) {
        console.error('Error with /api/collections:', error)
        return createTextResponse('Internal Server Error', 500)
      }
    }

    // Single collection operations (PUT and DELETE)
    const collectionMatch = url.pathname.match(/^\/api\/collections\/(\d+)$/)
    if (collectionMatch) {
      const collectionId = parseInt(collectionMatch[1])

      try {
        if (method === 'PUT') {
          const body = await req.json() as Partial<CollectionData>
          const { name, description, color } = body

          const existingCollection = await prisma.collection.findUnique({
            where: { id: collectionId }
          })

          if (!existingCollection) {
            return createTextResponse('Collection not found', 404)
          }

          const updateData: any = {
            updatedAt: new Date()
          }

          if (name) updateData.name = name
          if (description !== undefined) updateData.description = description
          if (color !== undefined) updateData.color = color

          const updatedCollection = await prisma.collection.update({
            where: { id: collectionId },
            data: updateData
          })

          return createResponse(updatedCollection)
        }

        if (method === 'DELETE') {
          const existingCollection = await prisma.collection.findUnique({
            where: { id: collectionId }
          })

          if (!existingCollection) {
            return createTextResponse('Collection not found', 404)
          }

          await prisma.collection.delete({
            where: { id: collectionId }
          })

          return new Response(null, { status: 204, headers: corsHeaders })
        }
      } catch (error) {
        console.error(`Error with /api/collections/${collectionId}:`, error)
        return createTextResponse('Internal Server Error', 500)
      }
    }

    // Single link operations (PUT and DELETE)
    const linkMatch = url.pathname.match(/^\/api\/links\/(\d+)$/)
    if (linkMatch) {
      const linkId = parseInt(linkMatch[1])

      try {
        if (method === 'PUT') {
          const body = await req.json() as Partial<LinkData>
          const { title, url: linkUrl, description, tags, isPublic, collectionId } = body

          const existingLink = await prisma.link.findUnique({
            where: { id: linkId }
          })

          if (!existingLink) {
            return createTextResponse('Link not found', 404)
          }

          const updateData: any = {
            updatedAt: new Date()
          }

          if (title !== undefined) updateData.title = title
          if (linkUrl !== undefined) updateData.url = linkUrl
          if (description !== undefined) updateData.description = description
          if (tags !== undefined) updateData.tags = tags
          if (isPublic !== undefined) updateData.isPublic = isPublic
          if (collectionId !== undefined) updateData.collectionId = collectionId

          const updatedLink = await prisma.link.update({
            where: { id: linkId },
            data: updateData
          })

          return createResponse(updatedLink)
        }

        if (method === 'DELETE') {
          const existingLink = await prisma.link.findUnique({
            where: { id: linkId }
          })

          if (!existingLink) {
            return createTextResponse('Link not found', 404)
          }

          await prisma.link.delete({
            where: { id: linkId }
          })

          return new Response(null, { status: 204, headers: corsHeaders })
        }
      } catch (error) {
        console.error(`Error with /api/links/${linkId}:`, error)
        return createTextResponse('Internal Server Error', 500)
      }
    }

    // Public links discovery API
    if (url.pathname === '/api/public/links') {
      try {
        if (method === 'GET') {
          const search = url.searchParams.get('search') || ''
          const page = parseInt(url.searchParams.get('page') || '1')
          const limit = parseInt(url.searchParams.get('limit') || '20')
          const offset = (page - 1) * limit

          let whereClause = { isPublic: true }
          if (search) {
            whereClause = {
              isPublic: true,
              OR: [
                { title: { contains: search, mode: 'insensitive' as const } },
                { description: { contains: search, mode: 'insensitive' as const } },
                { tags: { has: search } }
              ]
            }
          }

          const [links, total] = await Promise.all([
            prisma.link.findMany({
              where: whereClause,
              include: {
                collection: {
                  select: { name: true, color: true }
                }
              },
              orderBy: { createdAt: 'desc' },
              skip: offset,
              take: limit
            }),
            prisma.link.count({ where: whereClause })
          ])

          return createResponse({
            links,
            pagination: {
              page,
              limit,
              total,
              pages: Math.ceil(total / limit)
            }
          })
        }
      } catch (error) {
        console.error('Error with /api/public/links:', error)
        return createTextResponse('Internal Server Error', 500)
      }
    }

    // User management APIs
    if (url.pathname === '/api/users') {
      try {
        if (method === 'POST') {
          const body = await req.json() as UserData
          const { name, email, bio, isPublic = true } = body

          if (!name) {
            return createTextResponse('Name is required', 400)
          }

          const newUser = await prisma.user.create({
            data: {
              id: `user_${Date.now()}`,
              name,
              email,
              bio,
              isPublic,
              updatedAt: new Date()
            }
          })

          return createResponse(newUser, { status: 201 })
        }
      } catch (error) {
        console.error('Error with /api/users:', error)
        return createTextResponse('Internal Server Error', 500)
      }
    }

    // Saved links API
    if (url.pathname.match(/^\/api\/users\/([^\/]+)\/saved-links$/)) {
      const userId = url.pathname.split('/')[3]

      try {
        if (method === 'GET') {
          const savedLinks = await prisma.savedLink.findMany({
            where: { userId },
            include: {
              link: {
                include: {
                  collection: {
                    select: { name: true, color: true }
                  }
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          })

          return createResponse(savedLinks)
        }

        if (method === 'POST') {
          const body = await req.json()
          const { linkId } = body

          if (!linkId) {
            return createTextResponse('Link ID is required', 400)
          }

          const existingSave = await prisma.savedLink.findUnique({
            where: {
              userId_linkId: { userId, linkId }
            }
          })

          if (existingSave) {
            return createTextResponse('Link already saved', 400)
          }

          const savedLink = await prisma.savedLink.create({
            data: {
              userId,
              linkId
            }
          })

          return createResponse(savedLink, { status: 201 })
        }
      } catch (error) {
        console.error(`Error with /api/users/${userId}/saved-links:`, error)
        return createTextResponse('Internal Server Error', 500)
      }
    }

    // User single operations (GET, PUT, DELETE)
    const userMatch = url.pathname.match(/^\/api\/users\/([^\/]+)$/)
    if (userMatch) {
      const userId = userMatch[1]

      try {
        if (method === 'GET') {
          const user = await prisma.user.findUnique({
            where: { id: userId }
          })

          if (!user) {
            return createTextResponse('User not found', 404)
          }

          return createResponse(user)
        }

        if (method === 'PUT') {
          const body = await req.json() as Partial<UserData>
          const { name, email, bio, isPublic } = body

          const existingUser = await prisma.user.findUnique({
            where: { id: userId }
          })

          if (!existingUser) {
            return createTextResponse('User not found', 404)
          }

          const updateData: any = {
            updatedAt: new Date()
          }

          if (name !== undefined) updateData.name = name
          if (email !== undefined) updateData.email = email
          if (bio !== undefined) updateData.bio = bio
          if (isPublic !== undefined) updateData.isPublic = isPublic

          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData
          })

          return createResponse(updatedUser)
        }

        if (method === 'DELETE') {
          const existingUser = await prisma.user.findUnique({
            where: { id: userId }
          })

          if (!existingUser) {
            return createTextResponse('User not found', 404)
          }

          await prisma.savedLink.deleteMany({
            where: { userId }
          })

          await prisma.user.delete({
            where: { id: userId }
          })

          return new Response(null, { status: 204, headers: corsHeaders })
        }
      } catch (error) {
        console.error(`Error with /api/users/${userId}:`, error)
        return createTextResponse('Internal Server Error', 500)
      }
    }

    return createTextResponse('Not Found', 404)
  },
})

console.log(`🚀 LinkVault API server running on http://localhost:${server.port}`)

import { prisma } from 'db/client'

interface LinkData {
  title: string
  url: string
  description?: string
  tags?: string[]
}

const server = Bun.serve({
  port: 8080,
  fetch: async (req) => {
    const url = new URL(req.url)
    const method = req.method

    // Health check
    if (url.pathname === '/') {
      return new Response('LinkVault API Server is running!', {
        headers: { 'Content-Type': 'text/plain' }
      })
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

          return Response.json(links)
        }

        if (method === 'POST') {
          const body = await req.json() as LinkData
          const { title, url: linkUrl, description, tags = [] } = body

          if (!title || !linkUrl) {
            return new Response('Title and URL are required', { status: 400 })
          }

          const newLink = await prisma.link.create({
            data: {
              title,
              url: linkUrl,
              description,
              tags
            }
          })

          return Response.json(newLink, { status: 201 })
        }
      } catch (error) {
        console.error('Error with /api/links:', error)
        return new Response('Internal Server Error', { status: 500 })
      }
    }

    // Single link operations (PUT and DELETE)
    const linkMatch = url.pathname.match(/^\/api\/links\/(\d+)$/)
    if (linkMatch) {
      const linkId = parseInt(linkMatch[1])

      try {
        if (method === 'PUT') {
          const body = await req.json() as Partial<LinkData>
          const { title, url: linkUrl, description, tags } = body

          const existingLink = await prisma.link.findUnique({
            where: { id: linkId }
          })

          if (!existingLink) {
            return new Response('Link not found', { status: 404 })
          }

          const updatedLink = await prisma.link.update({
            where: { id: linkId },
            data: {
              ...(title && { title }),
              ...(linkUrl && { url: linkUrl }),
              ...(description !== undefined && { description }),
              ...(tags !== undefined && { tags })
            }
          })

          return Response.json(updatedLink)
        }

        if (method === 'DELETE') {
          const existingLink = await prisma.link.findUnique({
            where: { id: linkId }
          })

          if (!existingLink) {
            return new Response('Link not found', { status: 404 })
          }

          await prisma.link.delete({
            where: { id: linkId }
          })

          return new Response(null, { status: 204 })
        }
      } catch (error) {
        console.error(`Error with /api/links/${linkId}:`, error)
        return new Response('Internal Server Error', { status: 500 })
      }
    }

    return new Response('Not Found', { status: 404 })
  },
})

console.log(`🚀 LinkVault API server running on http://localhost:${server.port}`)

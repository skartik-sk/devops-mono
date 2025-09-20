import { prisma } from 'db/client'


const server = Bun.serve({
  port: 8080,
  fetch: async (req) => {
    const url = new URL(req.url)

    if (url.pathname === '/') {
      return new Response('Server is up!', { headers: { 'Content-Type': 'text/plain' } })
    }

    if (url.pathname === '/users' && req.method === 'GET') {
      try {
        const users = await prisma.user.findMany()
        return Response.json(users)
      } catch (error) {
        console.error('Error fetching users:', error)
        return new Response('Internal Server Error', { status: 500 })
      }
    }

    if (url.pathname === '/users' && req.method === 'POST') {
      try {
        const body = await req.json()
        const { name, email } = body
        const newUser = await prisma.user.create({
          data: { name, email },
        })
        return Response.json(newUser, { status: 201 })
      } catch (error) {
        console.error('Error creating user:', error)
        return new Response('Internal Server Error', { status: 500 })
      }
    }

    if (url.pathname === '/todos' && req.method === 'GET') {
      try {
        const todos = await prisma.todo.findMany()
        return Response.json(todos)
      } catch (error) {
        console.error('Error fetching todos:', error)
        return new Response('Internal Server Error', { status: 500 })
      }
    }

    if (url.pathname === '/todos' && req.method === 'POST') {
      try {
        const body = await req.json()
        const { title, userId } = body
        const newTodo = await prisma.todo.create({
          data: { title, completed: false, userId },
        })
        return Response.json(newTodo, { status: 201 })
      } catch (error) {
        console.error('Error creating todo:', error)
        return new Response('Internal Server Error', { status: 500 })
      }
    }

    return new Response('Not Found', { status: 404 })
  },
})

console.log(`Server is running on http://localhost:${server.port}`)

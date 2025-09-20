import { prisma } from 'db/client'
import React from 'react'


export default  async function Home() {

  const users= await prisma.user.findMany()

  return ( 
    <div>
      <h1 className="text-3xl font-bold underline">Hello, World!</h1>
      <h1 className="text-2xl font-bold mt-4">Welcome to the User from update</h1>
      <h2 className="text-2xl font-bold mt-4">Users:</h2>
      <ul>
        {users && users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  )
}

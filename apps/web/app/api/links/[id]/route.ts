import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { id } = params

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://linkvault.skartik.xyz'}/api/links/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error proxying PUT request:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://linkvault.skartik.xyz'}/api/links/${id}`, {
      method: 'DELETE',
    })

    if (response.status === 204) {
      return NextResponse.json(null, { status: 204 })
    }

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error proxying DELETE request:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
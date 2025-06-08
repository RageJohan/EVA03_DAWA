import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { pathname } = new URL(request.url)
  const parts = pathname.split('/')
  const id = parts[parts.length - 1]

  const orden = await prisma.ordenCompra.findUnique({
    where: { NumOrden: Number(id) },
  })

  if (!orden) return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })

  return NextResponse.json(orden)
}

export async function PUT(request: Request) {
  const { pathname } = new URL(request.url)
  const parts = pathname.split('/')
  const id = parts[parts.length - 1]

  const data = await request.json()
  const orden = await prisma.ordenCompra.update({
    where: { NumOrden: Number(id) },
    data,
  })

  return NextResponse.json(orden)
}

export async function DELETE(request: Request) {
  const { pathname } = new URL(request.url)
  const parts = pathname.split('/')
  const id = parts[parts.length - 1]

  await prisma.ordenCompra.delete({ where: { NumOrden: Number(id) } })
  return NextResponse.json({ status: 'deleted' })
}

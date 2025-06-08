import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

function getIdFromUrl(request: Request): number {
  const url = new URL(request.url)
  const segments = url.pathname.split('/')
  return Number(segments[segments.length - 1])
}

export async function GET(request: Request) {
  const id = getIdFromUrl(request)
  const orden = await prisma.ordenCompra.findUnique({
    where: { NumOrden: id },
  })

  if (!orden) {
    return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
  }

  return NextResponse.json(orden)
}

export async function PUT(request: Request) {
  const id = getIdFromUrl(request)
  const data = await request.json()
  const orden = await prisma.ordenCompra.update({
    where: { NumOrden: id },
    data,
  })

  return NextResponse.json(orden)
}

export async function DELETE(request: Request) {
  const id = getIdFromUrl(request)
  await prisma.ordenCompra.delete({ where: { NumOrden: id } })
  return NextResponse.json({ status: 'deleted' })
}

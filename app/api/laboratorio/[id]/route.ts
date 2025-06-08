import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { pathname } = new URL(request.url)
  const parts = pathname.split('/')
  const id = parts[parts.length - 1]  // Extraemos el id desde la url

  const lab = await prisma.laboratorio.findUnique({
    where: { CodLab: Number(id) },
  })

  if (!lab) return NextResponse.json({ error: 'Laboratorio no encontrado' }, { status: 404 })

  return NextResponse.json(lab)
}

export async function PUT(request: Request) {
  const { pathname } = new URL(request.url)
  const parts = pathname.split('/')
  const id = parts[parts.length - 1]

  const data = await request.json()
  const lab = await prisma.laboratorio.update({
    where: { CodLab: Number(id) },
    data,
  })
  return NextResponse.json(lab)
}

export async function DELETE(request: Request) {
  const { pathname } = new URL(request.url)
  const parts = pathname.split('/')
  const id = parts[parts.length - 1]

  await prisma.laboratorio.delete({ where: { CodLab: Number(id) } })
  return NextResponse.json({ status: 'deleted' })
}

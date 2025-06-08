import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

function getIdFromUrl(request: Request): number {
  const url = new URL(request.url)
  const segments = url.pathname.split('/')
  return Number(segments[segments.length - 1])
}

export async function GET(request: Request) {
  const id = getIdFromUrl(request)
  const lab = await prisma.laboratorio.findUnique({
    where: { CodLab: id },
  })

  if (!lab) {
    return NextResponse.json({ error: 'Laboratorio no encontrado' }, { status: 404 })
  }

  return NextResponse.json(lab)
}

export async function PUT(request: Request) {
  const id = getIdFromUrl(request)
  const data = await request.json()
  const lab = await prisma.laboratorio.update({
    where: { CodLab: id },
    data,
  })

  return NextResponse.json(lab)
}

export async function DELETE(request: Request) {
  const id = getIdFromUrl(request)
  await prisma.laboratorio.delete({ where: { CodLab: id } })
  return NextResponse.json({ status: 'deleted' })
}

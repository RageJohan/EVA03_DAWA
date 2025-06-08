import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, context: { params: { id: string } }) {
  const { params } = context;
  const lab = await prisma.laboratorio.findUnique({
    where: { CodLab: Number(params.id) },
  });
  if (!lab) return NextResponse.json({ error: 'Laboratorio no encontrado' }, { status: 404 });
  return NextResponse.json(lab);
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  const { params } = context;
  const data = await req.json();
  const lab = await prisma.laboratorio.update({
    where: { CodLab: Number(params.id) },
    data,
  });
  return NextResponse.json(lab);
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
  const { params } = context;
  await prisma.laboratorio.delete({ where: { CodLab: Number(params.id) } });
  return NextResponse.json({ status: 'deleted' });
}
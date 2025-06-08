import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const labs = await prisma.laboratorio.findMany();
  return NextResponse.json(labs);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newLab = await prisma.laboratorio.create({ data });
  return NextResponse.json(newLab);
}

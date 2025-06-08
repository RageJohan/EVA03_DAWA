import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const ordenes = await prisma.ordenCompra.findMany({
      include: { laboratorio: true }, // Incluye los datos del laboratorio
    });
    return NextResponse.json(ordenes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener órdenes de compra' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const nuevaOrden = await prisma.ordenCompra.create({
      data,
    });
    return NextResponse.json(nuevaOrden);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al crear orden de compra' }, { status: 500 });
  }
}

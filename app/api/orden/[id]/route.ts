import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type Params = {
  params: { id: string }
};

export async function PUT(req: Request, { params }: Params) {
  try {
    const data = await req.json();
    const ordenActualizada = await prisma.ordenCompra.update({
      where: { NumOrden: Number(params.id) },
      data,
    });
    return NextResponse.json(ordenActualizada);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al actualizar orden de compra' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await prisma.ordenCompra.delete({
      where: { NumOrden: Number(params.id) },
    });
    return NextResponse.json({ message: 'Orden eliminada correctamente' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar orden de compra' }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const orden = await prisma.ordenCompra.findUnique({
    where: { NumOrden: Number(params.id) },
  });
  if (!orden) return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
  return NextResponse.json(orden);
}
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function getIdFromUrl(request: Request): number {
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  return Number(segments[segments.length - 1]);
}

export async function GET(request: Request) {
  const id = getIdFromUrl(request);

  const orden = await prisma.ordenCompra.findUnique({
    where: { NumOrden: id },
  });

  if (!orden) {
    return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
  }

  return NextResponse.json(orden);
}

export async function PUT(request: Request) {
  const id = getIdFromUrl(request);
  const data = await request.json();

  try {
    const ordenActualizada = await prisma.ordenCompra.update({
      where: { NumOrden: id },
      data,
    });

    return NextResponse.json(ordenActualizada);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al actualizar orden de compra' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const id = getIdFromUrl(request);

  try {
    await prisma.ordenCompra.delete({
      where: { NumOrden: id },
    });

    return NextResponse.json({ message: 'Orden eliminada correctamente' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar orden de compra' }, { status: 500 });
  }
}
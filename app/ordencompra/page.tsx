'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface OrdenCompra {
  idOrdenCompra: number;
  fecha: string;
  idLaboratorio: number;
}

export default function OrdenCompraPage() {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);

  useEffect(() => {
    fetch('/api/ordenes')
      .then(res => res.json())
      .then(setOrdenes);
  }, []);

  function handleEliminar(id: number) {
    if (confirm('¿Eliminar esta orden de compra?')) {
      fetch(`/api/orden/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) {
            setOrdenes(ordenes.filter(o => o.idOrdenCompra !== id));
          } else {
            alert('Error al eliminar');
          }
        });
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Órdenes de Compra</h1>
      <Link href="/ordencompra/new" className="text-blue-500 mb-4 inline-block">+ Nueva Orden</Link>
      <table className="min-w-full bg-white border border-gray-300 rounded shadow mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Fecha</th>
            <th className="px-4 py-2 text-left">Laboratorio</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((o, i) => (
            <tr key={o.idOrdenCompra} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{i + 1}</td>
              <td className="px-4 py-2">{o.fecha}</td>
              <td className="px-4 py-2">{o.idLaboratorio}</td>
              <td className="px-4 py-2 space-x-2">
                <Link href={`/ordencompra/${o.idOrdenCompra}/edit`} className="text-blue-500 hover:underline">Editar</Link>
                <button onClick={() => handleEliminar(o.idOrdenCompra)} className="text-red-500 hover:underline">Eliminar</button>
              </td>
            </tr>
          ))}
          {ordenes.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">No hay órdenes registradas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface OrdenCompra {
  NumOrden: number
  FechaEmision: string
  Situacion: string
  Total: number
  CodLab: number
}

export default function OrdenPage() {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([])

  useEffect(() => {
    fetch('/api/orden')
      .then(res => res.json())
      .then(setOrdenes)
  }, [])

  const eliminar = async (id: number) => {
    if (confirm('¿Eliminar esta orden?')) {
      await fetch(`/api/orden/${id}`, { method: 'DELETE' })
      setOrdenes(ordenes.filter(o => o.NumOrden !== id))
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Órdenes de Compra</h1>
      <Link href="/compras/orden/new" className="text-blue-500 mb-4 inline-block">+ Nueva Orden</Link>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th><th>Fecha</th><th>Situación</th><th>Total</th><th>CodLab</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((o, i) => (
              <tr key={o.NumOrden} className="border-t hover:bg-gray-50">
                <td>{i+1}</td>
                <td>{new Date(o.FechaEmision).toLocaleDateString()}</td>
                <td>{o.Situacion}</td>
                <td>S/ {o.Total.toFixed(2)}</td>
                <td>{o.CodLab}</td>
                <td className="space-x-2">
                  <Link href={`/compras/orden/${o.NumOrden}/edit`} className="text-green-600">Editar</Link>
                  <button onClick={() => eliminar(o.NumOrden)} className="text-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
            {ordenes.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">No hay órdenes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

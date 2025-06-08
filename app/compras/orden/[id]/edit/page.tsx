'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type OrdenCompraForm = {
  FechaEmision: string;
  Situacion: string;
  Total: number | string;
  CodLab: number | string;
};

export default function EditOrden({ params }: { params: { id: string } }) {
  const [orden, setOrden] = useState<OrdenCompraForm | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/orden/${params.id}`)
      .then(res => res.json())
      .then(data => {
        // Convertir FechaEmision a string tipo yyyy-mm-dd para input date
        setOrden({
          FechaEmision: data.FechaEmision ? data.FechaEmision.substring(0, 10) : '',
          Situacion: data.Situacion,
          Total: data.Total,
          CodLab: data.CodLab
        })
      })
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!orden) return

    await fetch(`/api/orden/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        FechaEmision: new Date(orden.FechaEmision).toISOString(),
        Situacion: orden.Situacion,
        Total: parseFloat(orden.Total.toString()),
        CodLab: parseInt(orden.CodLab.toString())
      })
    })
    router.push('/compras/orden')
  }

  if (!orden) return <p>Cargando...</p>

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-xl font-bold mb-4">Editar Orden de Compra</h1>
      <input
        type="date"
        value={orden.FechaEmision}
        onChange={e => setOrden({ ...orden, FechaEmision: e.target.value })}
        className="block border p-2 my-2 w-full"
      />
      <input
        type="text"
        value={orden.Situacion}
        onChange={e => setOrden({ ...orden, Situacion: e.target.value })}
        className="block border p-2 my-2 w-full"
      />
      <input
        type="number"
        value={orden.Total}
        step="0.01"
        onChange={e => setOrden({ ...orden, Total: e.target.value })}
        className="block border p-2 my-2 w-full"
      />
      <input
        type="number"
        value={orden.CodLab}
        onChange={e => setOrden({ ...orden, CodLab: e.target.value })}
        className="block border p-2 my-2 w-full"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Actualizar</button>
    </form>
  )
}

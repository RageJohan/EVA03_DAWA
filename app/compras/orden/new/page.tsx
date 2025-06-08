'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewOrden() {
  const router = useRouter()
  const [form, setForm] = useState({ FechaEmision: '', Situacion: '', Total: '', CodLab: '' })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    await fetch('/api/orden', {
      method: 'POST',
      body: JSON.stringify({
        FechaEmision: new Date(form.FechaEmision).toISOString(),
        Situacion: form.Situacion,
        Total: parseFloat(form.Total),
        CodLab: parseInt(form.CodLab)
      })
    })
    router.push('/compras/orden')
  }

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-xl font-bold mb-4">Nueva Orden de Compra</h1>
      <input type="date" value={form.FechaEmision} onChange={e => setForm({ ...form, FechaEmision: e.target.value })} className="block border p-2 my-2 w-full" />
      <input type="text" placeholder="Situación" value={form.Situacion} onChange={e => setForm({ ...form, Situacion: e.target.value })} className="block border p-2 my-2 w-full" />
      <input type="number" placeholder="Total" step="0.01" value={form.Total} onChange={e => setForm({ ...form, Total: e.target.value })} className="block border p-2 my-2 w-full" />
      <input type="number" placeholder="CodLab" value={form.CodLab} onChange={e => setForm({ ...form, CodLab: e.target.value })} className="block border p-2 my-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
    </form>
  )
}

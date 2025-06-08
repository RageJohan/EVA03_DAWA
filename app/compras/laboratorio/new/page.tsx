'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewLaboratorio() {
  const router = useRouter()
  const [form, setForm] = useState({ RazonSocial: '', Ruc: '', Direccion: '', Contacto: '', Telefono: '', Email: '' })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    await fetch('/api/laboratorio', {
      method: 'POST',
      body: JSON.stringify(form)
    })
    router.push('/compras/laboratorio')
  }

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-xl font-bold mb-4">Nuevo Laboratorio</h1>
      {['RazonSocial','Ruc','Direccion','Contacto','Telefono','Email'].map(field => (
        <input key={field} type="text" placeholder={field} value={(form as any)[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} className="block border p-2 my-2 w-full" />
      ))}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
    </form>
  )
}

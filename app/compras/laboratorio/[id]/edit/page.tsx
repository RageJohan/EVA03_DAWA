'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Laboratorio = {
  CodLab: number;
  RazonSocial: string;
  Ruc: string;
  Direccion: string;
  Contacto: string;
  Telefono: string;
  Email: string;
};

export default function EditLaboratorio({ params }: { params: { id: string } }) {
  const [lab, setLab] = useState<Laboratorio | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/laboratorio/${params.id}`)
      .then(res => res.json())
      .then(setLab)
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await fetch(`/api/laboratorio/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(lab)
    })
    router.push('/compras/laboratorio')
  }

  if (!lab) return <p>Cargando...</p>

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-xl font-bold mb-4">Editar Laboratorio</h1>
      {['RazonSocial','Ruc','Direccion','Contacto','Telefono','Email'].map(field => (
        <input 
          key={field} 
          type="text" 
          value={lab[field as keyof Laboratorio]} 
          onChange={e => setLab({ ...lab, [field]: e.target.value })} 
          className="block border p-2 my-2 w-full" 
        />
      ))}
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Actualizar</button>
    </form>
  )
}

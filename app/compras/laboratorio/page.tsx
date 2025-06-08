'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Laboratorio {
  CodLab: number
  RazonSocial: string
  Ruc: string
  Direccion: string
  Contacto: string
  Telefono: string
  Email: string
}

export default function LaboratorioPage() {
  const [labs, setLabs] = useState<Laboratorio[]>([])

  useEffect(() => {
    fetch('/api/laboratorio')
      .then(res => res.json())
      .then(setLabs)
  }, [])

  const eliminar = async (id: number) => {
    if (confirm('¿Seguro que deseas eliminar este laboratorio?')) {
      await fetch(`/api/laboratorio/${id}`, { method: 'DELETE' })
      setLabs(labs.filter(l => l.CodLab !== id))
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Laboratorios</h1>
      <Link href="/compras/laboratorio/new" className="text-blue-500 mb-4 inline-block">+ Nuevo Laboratorio</Link>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th><th>Razón Social</th><th>RUC</th><th>Contacto</th><th>Teléfono</th><th>Email</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {labs.map((l, i) => (
              <tr key={l.CodLab} className="border-t hover:bg-gray-50">
                <td>{i+1}</td>
                <td>{l.RazonSocial}</td>
                <td>{l.Ruc}</td>
                <td>{l.Contacto}</td>
                <td>{l.Telefono}</td>
                <td>{l.Email}</td>
                <td className="space-x-2">
                  <Link href={`/compras/laboratorio/${l.CodLab}/edit`} className="text-green-600">Editar</Link>
                  <button onClick={() => eliminar(l.CodLab)} className="text-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
            {labs.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">No hay laboratorios.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

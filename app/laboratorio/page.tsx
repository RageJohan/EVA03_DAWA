'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Laboratorio {
  idLaboratorio: number;
  nombre: string;
  direccion: string;
}

export default function LaboratorioPage() {
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([]);

  useEffect(() => {
    fetch('/api/laboratorios')
      .then(res => res.json())
      .then(setLaboratorios);
  }, []);

  function handleEliminar(id: number) {
    if (confirm('¿Deseas eliminar este laboratorio?')) {
      fetch(`/api/laboratorios/${id}`, {
        method: 'DELETE',
      }).then(res => {
        if (res.ok) {
          setLaboratorios(laboratorios.filter(l => l.idLaboratorio !== id));
        } else {
          alert('Error al eliminar');
        }
      });
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Laboratorios</h1>
      <Link href="/laboratorio/new" className="text-blue-500 mb-4 inline-block">+ Nuevo Laboratorio</Link>
      <table className="min-w-full bg-white border border-gray-300 rounded shadow mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Dirección</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {laboratorios.map((l, i) => (
            <tr key={l.idLaboratorio} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{i + 1}</td>
              <td className="px-4 py-2">{l.nombre}</td>
              <td className="px-4 py-2">{l.direccion}</td>
              <td className="px-4 py-2 space-x-2">
                <Link href={`/laboratorio/${l.idLaboratorio}/edit`} className="text-blue-500 hover:underline">Editar</Link>
                <button onClick={() => handleEliminar(l.idLaboratorio)} className="text-red-500 hover:underline">Eliminar</button>
              </td>
            </tr>
          ))}
          {laboratorios.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No hay laboratorios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

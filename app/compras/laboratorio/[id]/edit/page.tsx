'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

type Laboratorio = {
  CodLab: number;
  RazonSocial: string;
  Ruc: string;
  Direccion: string;
  Contacto: string;
  Telefono: string;
  Email: string;
};

export default function EditLaboratorio() {
  const { id } = useParams(); // ✅ usamos useParams para obtener id
  const [lab, setLab] = useState<Laboratorio | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    fetch(`/api/laboratorio/${id}`)
      .then((res) => res.json())
      .then(setLab);
  }, [id]);

  const handleChange = (field: keyof Laboratorio, value: string) => {
    if (!lab) return;
    setLab({ ...lab, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch(`/api/laboratorio/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lab),
    });
    router.push('/compras/laboratorio');
  };

  if (!lab) return <p>Cargando...</p>;

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-xl font-bold mb-4">Editar Laboratorio</h1>
      {(['RazonSocial', 'Ruc', 'Direccion', 'Contacto', 'Telefono', 'Email'] as (keyof Laboratorio)[]).map((field) => (
        <input
          key={field}
          type="text"
          value={lab[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          className="block border p-2 my-2 w-full"
          placeholder={field}
        />
      ))}
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Actualizar</button>
    </form>
  );
}

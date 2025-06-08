type Laboratorio = {
  CodLab: number;
  RazonSocial: string;
  Ruc: string;
  Direccion: string;
  Contacto: string;
  Telefono: string;
  Email: string;
};

export default async function EditLaboratorio({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/laboratorio/${params.id}`, {
    cache: 'no-store' // <- para evitar caché y mostrar datos actualizados
  });

  if (!res.ok) {
    return <div className="p-4 text-red-500">Error al cargar el laboratorio</div>;
  }

  const lab: Laboratorio = await res.json();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Editar Laboratorio</h1>
      <p><strong>Razón Social:</strong> {lab.RazonSocial}</p>
      <p><strong>RUC:</strong> {lab.Ruc}</p>
      <p><strong>Dirección:</strong> {lab.Direccion}</p>
      <p><strong>Contacto:</strong> {lab.Contacto}</p>
      <p><strong>Teléfono:</strong> {lab.Telefono}</p>
      <p><strong>Email:</strong> {lab.Email}</p>
    </div>
  );
}

type Laboratorio = {
  CodLab: number;
  RazonSocial: string;
  Ruc: string;
  Direccion: string;
  Contacto: string;
  Telefono: string;
  Email: string;
};

type Props = {
  params: { id: string };
};

export default async function EditLaboratorio({ params }: Props) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/laboratorio/${params.id}`);
  const lab: Laboratorio = await res.json();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Editar Laboratorio</h1>
      <p>Nombre actual: {lab.RazonSocial}</p>
      {/* Aquí podrías usar un formulario con action en vez de JS, o delegar a un Client Component */}
    </div>
  );
}

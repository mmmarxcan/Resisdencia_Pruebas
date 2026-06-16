import { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Eye, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import api from '../../api/axiosConfig';

interface Solicitud {
  id: number;
  incoterm: string;
  tipo_servicio: string;
  descripcion_material: string;
  valor_factura: number;
  divisa: string;
  peso_total: number;
  unidad_peso: string;
  numero_bultos: number;
  mercancia_adicionales: boolean;
  servicios_adicionales: string[] | object;
  estatus: string;
  created_at: string;
  updated_at: string;
}

export default function ListaSolicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    obtenerSolicitudes();
  }, []);

  const obtenerSolicitudes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/solicitudes');
      setSolicitudes(response.data.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las solicitudes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadgeColor = (estatus: string) => {
    const colores: { [key: string]: string } = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      procesando: 'bg-blue-100 text-blue-800',
      enviado: 'bg-purple-100 text-purple-800',
      entregado: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
    };
    return colores[estatus.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const formatearServicios = (servicios: string[] | object) => {
    if (Array.isArray(servicios)) {
      return servicios.join(', ');
    }
    if (typeof servicios === 'object' && servicios !== null) {
      return Object.entries(servicios)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .join(', ');
    }
    return 'Ninguno';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6 flex items-center gap-3">
          <AlertCircle className="size-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (solicitudes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center py-12">
          <p className="text-slate-600 text-lg">No hay solicitudes guardadas aún</p>
          <p className="text-slate-500 text-sm mt-2">
            Crea una nueva solicitud usando el formulario o el asistente de chat
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Mis Solicitudes ({solicitudes.length})</CardTitle>
          <CardDescription>Historial completo de solicitudes de logística</CardDescription>
        </CardHeader>
      </Card>

      {/* Vista de Tarjetas */}
      <div className="grid grid-cols-1 gap-4">
        {solicitudes.map((solicitud) => (
          <Card key={solicitud.id} className="hover:shadow-lg transition">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Izquierda */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-blue-600">
                      Solicitud #{solicitud.id}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadgeColor(solicitud.estatus)}`}>
                      {solicitud.estatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-sm space-y-1">
                    <p><span className="font-semibold text-slate-700">Tipo de Servicio:</span> {solicitud.tipo_servicio}</p>
                    <p><span className="font-semibold text-slate-700">Incoterm:</span> {solicitud.incoterm}</p>
                    <p><span className="font-semibold text-slate-700">Descripción:</span> {solicitud.descripcion_material}</p>
                  </div>
                </div>

                {/* Derecha */}
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded p-3 space-y-1 text-sm">
                    <p><span className="font-semibold text-slate-700">Valor:</span> {solicitud.valor_factura} {solicitud.divisa}</p>
                    <p><span className="font-semibold text-slate-700">Peso:</span> {solicitud.peso_total} {solicitud.unidad_peso}</p>
                    <p><span className="font-semibold text-slate-700">Bultos:</span> {solicitud.numero_bultos}</p>
                    <p>
                      <span className="font-semibold text-slate-700">Mercancía adicional:</span> 
                      {solicitud.mercancia_adicionales ? ' Sí' : ' No'}
                    </p>
                  </div>

                  <div className="text-sm">
                    <p><span className="font-semibold text-slate-700">Servicios adicionales:</span></p>
                    <p className="text-slate-600">{formatearServicios(solicitud.servicios_adicionales)}</p>
                  </div>
                </div>
              </div>

              {/* Fecha y Acciones */}
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-xs text-slate-500">
                  Creado: {new Date(solicitud.created_at).toLocaleDateString('es-ES', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    onClick={() => setSelectedId(selectedId === solicitud.id ? null : solicitud.id)}
                  >
                    <Eye className="size-4" />
                    {selectedId === solicitud.id ? 'Ocultar' : 'Detalles'}
                  </Button>
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                    Eliminar
                  </Button>
                </div>
              </div>

              {/* Detalles expandibles */}
              {selectedId === solicitud.id && (
                <div className="mt-4 pt-4 border-t bg-blue-50 rounded p-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <p><span className="font-semibold">ID de Solicitud:</span> {solicitud.id}</p>
                    <p><span className="font-semibold">Última actualización:</span> {new Date(solicitud.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

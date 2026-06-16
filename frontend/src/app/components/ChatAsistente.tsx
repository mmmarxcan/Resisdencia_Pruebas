import { useEffect, useRef, useState } from 'react';
import { Bot, Send, User, Loader2, CheckCircle2, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';
import api from '../../api/axiosConfig';

type Rol = 'asistente' | 'usuario';

interface Mensaje {
  id: string;
  rol: Rol;
  contenido: string;
  hora: string;
}

interface SolicitudDraft {
  incoterm?: string;
  tipo_servicio?: string;
  descripcion_material?: string;
  valor_factura?: number;
  divisa?: string;
  peso_total?: number;
  unidad_peso?: string;
  numero_bultos?: number;
  mercancia_adicionales?: boolean;
  servicios_adicionales?: string[];
  direccion_origen?: string;
  direccion_destino?: string;
}

type Paso =
  | 'incoterm'
  | 'tipo_servicio'
  | 'descripcion_material'
  | 'valor_factura'
  | 'divisa'
  | 'peso_total'
  | 'unidad_peso'
  | 'numero_bultos'
  | 'servicios_adicionales'
  | 'direccion_origen'
  | 'direccion_destino'
  | 'confirmar'
  | 'completado';

const OPCIONES_SERVICIO = [
  { valor: 'aereo', etiqueta: 'Aéreo' },
  { valor: 'maritimo', etiqueta: 'Marítimo' },
  { valor: 'terrestre', etiqueta: 'Terrestre' },
  { valor: 'multimodal', etiqueta: 'Multimodal' },
];

const OPCIONES_INCOTERM = [
  {valor: 'FOB' , etiqueta: 'FOB'},
  {valor: 'CIF' , etiqueta: 'CIF'},
  {valor: 'EXW' , etiqueta: 'EXW'},
  {valor: 'DDP' , etiqueta: 'DDP'},
];

const OPCIONES_DIVISA = ['USD', 'EUR', 'MXN', 'CAD'];

const OPCIONES_PESO = [
  { valor: 'kg', etiqueta: 'Kilogramos (kg)' },
  { valor: 'lb', etiqueta: 'Libras (lb)' },
  { valor: 'ton', etiqueta: 'Toneladas (ton)' },
];

const PREGUNTAS: Record<Paso, string> = {
  incoterm: '¿Cuál es el Incoterm de la operación? (Ej: FOB, CIF, EXW)',
  tipo_servicio: '¿Qué tipo de servicio logístico necesitas?',
  descripcion_material: 'Describe el material que vas a transportar:',
  valor_factura: '¿Cuál es el valor de la factura comercial?',
  divisa: '¿En qué divisa está expresado el valor?',
  peso_total: '¿Cuál es el peso total de la carga?',
  unidad_peso: '¿En qué unidad expresas el peso?',
  numero_bultos: '¿Cuántos bultos conforman el embarque?',
  servicios_adicionales:
    '¿Necesitas servicios adicionales? Escribe "seguro", "maniobras", "ambos" o "ninguno".',
  direccion_origen: 'Indica la dirección de origen (calle, ciudad, país):',
  direccion_destino: 'Indica la dirección de destino (calle, ciudad, país):',
  confirmar: 'Revisa el resumen. Escribe "confirmar" para enviar o "reiniciar" para empezar de nuevo.',
  completado: '',
};

function horaActual() {
  return new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

function crearMensaje(rol: Rol, contenido: string): Mensaje {
  return { id: crypto.randomUUID(), rol, contenido, hora: horaActual() };
}

function resumenSolicitud(draft: SolicitudDraft): string {
  const servicios =
    draft.servicios_adicionales?.length
      ? draft.servicios_adicionales.join(', ')
      : 'Ninguno';

  return [
    `Incoterm: ${draft.incoterm}`,
    `Servicio: ${draft.tipo_servicio}`,
    `Material: ${draft.descripcion_material}`,
    `Valor: ${draft.valor_factura} ${draft.divisa}`,
    `Peso: ${draft.peso_total} ${draft.unidad_peso}`,
    `Bultos: ${draft.numero_bultos}`,
    `Servicios adicionales: ${servicios}`,
    `Origen: ${draft.direccion_origen}`,
    `Destino: ${draft.direccion_destino}`,
  ].join('\n');
}

function parseServiciosAdicionales(texto: string): string[] {
  const normalizado = texto.toLowerCase().trim();
  if (normalizado === 'ninguno' || normalizado === 'no') return [];
  if (normalizado === 'ambos') return ['seguro', 'maniobras'];
  if (normalizado.includes('seguro') && normalizado.includes('maniobra')) {
    return ['seguro', 'maniobras'];
  }
  if (normalizado.includes('seguro')) return ['seguro'];
  if (normalizado.includes('maniobra')) return ['maniobras'];
  return [];
}

function validarPaso(paso: Paso, texto: string): string | null {
  const valor = texto.trim();

  switch (paso) {
    case 'incoterm':
      return valor.length >= 2 ? null : 'Indica un Incoterm válido (ej. FOB, CIF).';
    case 'tipo_servicio':
      return OPCIONES_SERVICIO.some((o) => o.valor === valor) ? null : 'Selecciona un tipo de servicio.';
    case 'descripcion_material':
      return valor.length >= 5 ? null : 'La descripción debe tener al menos 5 caracteres.';
    case 'valor_factura':
      return !Number.isNaN(Number(valor)) && Number(valor) >= 0
        ? null
        : 'Ingresa un valor numérico válido.';
    case 'divisa':
      return OPCIONES_DIVISA.includes(valor.toUpperCase())
        ? null
        : 'Selecciona una divisa válida (USD, EUR, MXN, CAD).';
    case 'peso_total':
      return !Number.isNaN(Number(valor)) && Number(valor) > 0
        ? null
        : 'Ingresa un peso numérico mayor a 0.';
    case 'unidad_peso':
      return OPCIONES_PESO.some((o) => o.valor === valor) ? null : 'Selecciona una unidad de peso.';
    case 'numero_bultos':
      return Number.isInteger(Number(valor)) && Number(valor) > 0
        ? null
        : 'Ingresa un número entero de bultos mayor a 0.';
    case 'servicios_adicionales':
      return parseServiciosAdicionales(valor).length >= 0 ? null : 'Respuesta no reconocida.';
    case 'direccion_origen':
    case 'direccion_destino':
      return valor.length >= 5 ? null : 'La dirección debe ser más descriptiva.';
    case 'confirmar':
      if (['confirmar', 'reiniciar'].includes(valor.toLowerCase())) return null;
      return 'Escribe "confirmar" para enviar o "reiniciar" para empezar de nuevo.';
    default:
      return null;
  }
}

function siguientePaso(paso: Paso): Paso {
  const orden: Paso[] = [
    'incoterm',
    'tipo_servicio',
    'descripcion_material',
    'divisa',
    'valor_factura',
    'unidad_peso',
    'peso_total',
    'numero_bultos',
    'servicios_adicionales',
    'direccion_origen',
    'direccion_destino',
    'confirmar',
    'completado',
  ];
  const indice = orden.indexOf(paso);
  return orden[indice + 1] ?? 'completado';
}

function actualizarDraft(paso: Paso, texto: string, draft: SolicitudDraft): SolicitudDraft {
  const valor = texto.trim();

  switch (paso) {
    case 'incoterm':
      return { ...draft, incoterm: valor.toUpperCase() };
    case 'tipo_servicio':
      return { ...draft, tipo_servicio: valor };
    case 'descripcion_material':
      return { ...draft, descripcion_material: valor };
    case 'divisa':
      return { ...draft, divisa: valor.toUpperCase() };
    case 'valor_factura':
      return { ...draft, valor_factura: Number(valor) };
    case 'unidad_peso':
      return { ...draft, unidad_peso: valor };
      case 'peso_total':
      return { ...draft, peso_total: Number(valor) };
    case 'numero_bultos':
      return { ...draft, numero_bultos: Number(valor) };
    case 'servicios_adicionales':
      return {
        ...draft,
        servicios_adicionales: parseServiciosAdicionales(valor),
        mercancia_adicionales: parseServiciosAdicionales(valor).length > 0,
      };
    case 'direccion_origen':
      return { ...draft, direccion_origen: valor };
    case 'direccion_destino':
      return { ...draft, direccion_destino: valor };
    default:
      return draft;
  }
}

export default function ChatAsistente() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    crearMensaje(
      'asistente',
      '¡Hola! Soy el asistente de Travelyx Logistics. Te guiaré paso a paso para crear tu solicitud de servicio logístico internacional.',
    ),
    crearMensaje('asistente', PREGUNTAS.incoterm),
  ]);
  const [entrada, setEntrada] = useState('');
  const [paso, setPaso] = useState<Paso>('incoterm');
  const [draft, setDraft] = useState<SolicitudDraft>({});
  const [enviando, setEnviando] = useState(false);
  const [escribiendo, setEscribiendo] = useState(false);
  const finMensajesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finMensajesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, escribiendo]);

  const agregarMensajes = (...nuevos: Mensaje[]) => {
    setMensajes((prev) => [...prev, ...nuevos]);
  };

  const responderAsistente = async (contenido: string, delay = 600) => {
    setEscribiendo(true);
    await new Promise((resolve) => setTimeout(resolve, delay));
    agregarMensajes(crearMensaje('asistente', contenido));
    setEscribiendo(false);
  };

  const enviarSolicitud = async (solicitud: SolicitudDraft) => {
    setEnviando(true);
    try {
      const payload = {
        incoterm: solicitud.incoterm,
        tipo_servicio: solicitud.tipo_servicio,
        descripcion_material: solicitud.descripcion_material,
        valor_factura: solicitud.valor_factura,
        divisa: solicitud.divisa,
        peso_total: solicitud.peso_total,
        unidad_peso: solicitud.unidad_peso,
        numero_bultos: solicitud.numero_bultos,
        mercancia_adicionales: solicitud.mercancia_adicionales ?? false,
        servicios_adicionales: solicitud.servicios_adicionales ?? [],
        direcciones: [
          {
            tipo: 'principal',
            direccion_origen: solicitud.direccion_origen,
            direccion_destino: solicitud.direccion_destino,
          },
        ],
      };

      const { data } = await api.post('/solicitudes', payload);
      await responderAsistente(
        `¡Solicitud creada con éxito! ${data.mensaje ?? ''}\n\nID de solicitud: ${data.data?.id ?? '—'}`,
        800,
      );
      setPaso('completado');
    } catch (error: unknown) {
      const mensajeError =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { mensaje?: string; error?: string } } }).response?.data
              ?.mensaje ??
            (error as { response?: { data?: { error?: string } } }).response?.data?.error
          : null;

      await responderAsistente(
        `No pude guardar la solicitud: ${mensajeError ?? 'Error de conexión con el servidor.'}\n\nEscribe "confirmar" para reintentar o "reiniciar" para empezar de nuevo.`,
      );
    } finally {
      setEnviando(false);
    }
  };

  const reiniciarChat = async () => {
    setDraft({});
    setPaso('incoterm');
    setEntrada('');
    setMensajes([
      crearMensaje('asistente', 'Reiniciemos. ' + PREGUNTAS.incoterm),
    ]);
  };

  const enviarMensaje = async (textoOverride?: string) => {
    const texto = (textoOverride ?? entrada).trim();
    if (!texto || enviando || paso === 'completado') return;

    agregarMensajes(crearMensaje('usuario', texto));
    setEntrada('');

    if (paso === 'confirmar' && texto.toLowerCase() === 'reiniciar') {
      await reiniciarChat();
      return;
    }

    const error = validarPaso(paso, texto);
    if (error) {
      await responderAsistente(error);
      return;
    }

    const nuevoDraft = actualizarDraft(paso, texto, draft);
    setDraft(nuevoDraft);

    const proximo = siguientePaso(paso);

    if (paso === 'confirmar' && texto.toLowerCase() === 'confirmar') {
      await enviarSolicitud(nuevoDraft);
      return;
    }

    if (proximo === 'confirmar') {
      setPaso('confirmar');
      await responderAsistente(
        `Perfecto, este es el resumen de tu solicitud:\n\n${resumenSolicitud(nuevoDraft)}\n\n${PREGUNTAS.confirmar}`,
        900,
      );
      return;
    }

    setPaso(proximo);
    await responderAsistente(PREGUNTAS[proximo]);
  };

  const opcionesRapidas = () => {
    if (paso === 'incoterm') return OPCIONES_INCOTERM;
    if (paso === 'tipo_servicio') return OPCIONES_SERVICIO;
    if (paso === 'divisa') return OPCIONES_DIVISA.map((d) => ({ valor: d, etiqueta: d }));
    if (paso === 'unidad_peso') return OPCIONES_PESO;
    if (paso === 'servicios_adicionales') {
      return [
        { valor: 'ninguno', etiqueta: 'Ninguno' },
        { valor: 'seguro', etiqueta: 'Seguro' },
        { valor: 'maniobras', etiqueta: 'Maniobras' },
        { valor: 'ambos', etiqueta: 'Ambos' },
      ];
    }
    if (paso === 'confirmar') {
      return [
        { valor: 'confirmar', etiqueta: 'Confirmar' },
        { valor: 'reiniciar', etiqueta: 'Reiniciar' },
      ];
    }
    return null;
  };

  const quickReplies = opcionesRapidas();

  return (
    <Card className="max-w-3xl mx-auto overflow-hidden shadow-lg border-0 ring-1 ring-slate-200">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border-2 border-white/30">
              <AvatarFallback className="bg-white/20 text-white">
                <Bot className="size-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-white text-lg">Asistente Travelyx</CardTitle>
              <CardDescription className="text-blue-100">
                Chat guiado para solicitudes logísticas
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            {paso === 'completado' ? 'Completado' : 'En línea'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[420px] px-4 py-4">
          <div className="space-y-4">
            {mensajes.map((mensaje) => (
              <div
                key={mensaje.id}
                className={cn(
                  'flex gap-3',
                  mensaje.rol === 'usuario' ? 'flex-row-reverse' : 'flex-row',
                )}
              >
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback
                    className={cn(
                      mensaje.rol === 'usuario'
                        ? 'bg-slate-800 text-white'
                        : 'bg-blue-100 text-blue-700',
                    )}
                  >
                    {mensaje.rol === 'usuario' ? (
                      <User className="size-4" />
                    ) : (
                      <Bot className="size-4" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={cn(
                    'flex flex-col max-w-[80%]',
                    mensaje.rol === 'usuario' ? 'items-end' : 'items-start',
                  )}
                >
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed',
                      mensaje.rol === 'usuario'
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-slate-100 text-slate-800 rounded-tl-sm',
                    )}
                  >
                    {mensaje.contenido}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {mensaje.hora}
                  </span>
                </div>
              </div>
            ))}

            {escribiendo && (
              <div className="flex gap-3">
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    <Bot className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                  <span className="size-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
                  <span className="size-2 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
                  <span className="size-2 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={finMensajesRef} />
          </div>
        </ScrollArea>

        {quickReplies && paso !== 'completado' && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {quickReplies.map((opcion) => (
              <Button
                key={opcion.valor}
                type="button"
                variant="outline"
                size="sm"
                disabled={enviando || escribiendo}
                onClick={() => enviarMensaje(opcion.valor)}
                className="rounded-full text-xs"
              >
                {opcion.etiqueta}
              </Button>
            ))}
          </div>
        )}

        <div className="border-t p-4 bg-slate-50/80">
          {paso === 'completado' ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-green-700 text-sm">
                <CheckCircle2 className="size-4" />
                Solicitud registrada correctamente
              </div>
              <Button type="button" variant="outline" size="sm" onClick={reiniciarChat}>
                <RotateCcw className="size-4" />
                Nueva solicitud
              </Button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                enviarMensaje();
              }}
              className="flex gap-2 items-end"
            >
              <Textarea
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    enviarMensaje();
                  }
                }}
                placeholder="Escribe tu respuesta..."
                rows={1}
                disabled={enviando || escribiendo}
                className="min-h-[44px] max-h-32 resize-none bg-white"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!entrada.trim() || enviando || escribiendo}
                className="shrink-0 size-11 bg-blue-600 hover:bg-blue-700"
              >
                {enviando ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

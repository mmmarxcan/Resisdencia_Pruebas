import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Plus, Trash2, Package, MapPin, DollarSign, Shield } from 'lucide-react';

interface Direccion {
  id: string;
  tipo: 'origen' | 'destino';
  direccion: string;
}

export default function FormularioSolicitud() {
  const [direcciones, setDirecciones] = useState<Direccion[]>([
    { id: '1', tipo: 'origen', direccion: '' },
    { id: '2', tipo: 'destino', direccion: '' }
  ]);

  const [formData, setFormData] = useState({
    incoterm: '',
    tipoServicio: '',
    descripcionMaterial: '',
    valorFactura: '',
    divisa: 'USD',
    pesoTotal: '',
    unidadPeso: 'kg',
    numeroBultos: '',
    seguro: false,
    maniobrasDescarga: false
  });

  const agregarDireccion = () => {
    const nuevaDireccion: Direccion = {
      id: Date.now().toString(),
      tipo: 'destino',
      direccion: ''
    };
    setDirecciones([...direcciones, nuevaDireccion]);
  };

  const eliminarDireccion = (id: string) => {
    if (direcciones.length > 1) {
      setDirecciones(direcciones.filter(d => d.id !== id));
    }
  };

  const actualizarDireccion = (id: string, campo: keyof Direccion, valor: string) => {
    setDirecciones(direcciones.map(d => 
      d.id === id ? { ...d, [campo]: valor } : d
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', { ...formData, direcciones });
    // Aquí iría la lógica para enviar los datos
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Datos de la Carga */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            <CardTitle>Datos de la Carga</CardTitle>
          </div>
          <CardDescription>
            Información básica sobre el material a transportar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="incoterm">Incoterm</Label>
              <Input
                id="incoterm"
                placeholder="Ej: FOB, CIF, EXW"
                value={formData.incoterm}
                onChange={(e) => setFormData({ ...formData, incoterm: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoServicio">Tipo de Servicio</Label>
              <Select
                value={formData.tipoServicio}
                onValueChange={(value) => setFormData({ ...formData, tipoServicio: value })}
              >
                <SelectTrigger id="tipoServicio">
                  <SelectValue placeholder="Selecciona un servicio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aereo">Aéreo</SelectItem>
                  <SelectItem value="maritimo">Marítimo</SelectItem>
                  <SelectItem value="terrestre">Terrestre</SelectItem>
                  <SelectItem value="multimodal">Multimodal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcionMaterial">Descripción del Material</Label>
            <Textarea
              id="descripcionMaterial"
              placeholder="Describe el material a transportar..."
              rows={4}
              value={formData.descripcionMaterial}
              onChange={(e) => setFormData({ ...formData, descripcionMaterial: e.target.value })}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroBultos">Número de Bultos</Label>
              <Input
                id="numeroBultos"
                type="number"
                placeholder="0"
                value={formData.numeroBultos}
                onChange={(e) => setFormData({ ...formData, numeroBultos: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pesoTotal">Peso Total</Label>
              <Input
                id="pesoTotal"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.pesoTotal}
                onChange={(e) => setFormData({ ...formData, pesoTotal: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unidadPeso">Unidad de Peso</Label>
              <Select
                value={formData.unidadPeso}
                onValueChange={(value) => setFormData({ ...formData, unidadPeso: value })}
              >
                <SelectTrigger id="unidadPeso">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                  <SelectItem value="lb">Libras (lb)</SelectItem>
                  <SelectItem value="ton">Toneladas (ton)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información Financiera */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <CardTitle>Información Financiera</CardTitle>
          </div>
          <CardDescription>
            Valor comercial de la mercancía
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valorFactura">Valor de Factura</Label>
              <Input
                id="valorFactura"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.valorFactura}
                onChange={(e) => setFormData({ ...formData, valorFactura: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="divisa">Divisa</Label>
              <Select
                value={formData.divisa}
                onValueChange={(value) => setFormData({ ...formData, divisa: value })}
              >
                <SelectTrigger id="divisa">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - Dólar Estadounidense</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                  <SelectItem value="CAD">CAD - Dólar Canadiense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Servicios Adicionales */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            <CardTitle>Servicios Adicionales</CardTitle>
          </div>
          <CardDescription>
            Selecciona los servicios complementarios que requieres
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="seguro"
              checked={formData.seguro}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, seguro: checked as boolean })
              }
            />
            <Label
              htmlFor="seguro"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Seguro de carga internacional
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="maniobras"
              checked={formData.maniobrasDescarga}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, maniobrasDescarga: checked as boolean })
              }
            />
            <Label
              htmlFor="maniobras"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Maniobras de descarga
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Direcciones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-600" />
                <CardTitle>Direcciones de Envío</CardTitle>
              </div>
              <CardDescription>
                Agrega las direcciones de origen y destino
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={agregarDireccion}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Agregar Dirección
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {direcciones.map((direccion, index) => (
            <div key={direccion.id} className="p-4 border rounded-lg space-y-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dirección {index + 1}</span>
                {direcciones.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => eliminarDireccion(direccion.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={direccion.tipo}
                    onValueChange={(value) => 
                      actualizarDireccion(direccion.id, 'tipo', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="origen">Origen</SelectItem>
                      <SelectItem value="destino">Destino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>
                    {direccion.tipo === 'origen' ? 'Dirección de Origen' : 'Dirección de Destino'}
                  </Label>
                  <Input
                    placeholder="Calle, número, ciudad, país..."
                    value={direccion.direccion}
                    onChange={(e) => 
                      actualizarDireccion(direccion.id, 'direccion', e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Botones de Acción */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" size="lg" className="gap-2">
          <Package className="h-4 w-4" />
          Guardar Solicitud
        </Button>
      </div>
    </form>
  );
}

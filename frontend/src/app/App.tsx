import FormularioSolicitud from './components/FormularioSolicitud';
import ChatAsistente from './components/ChatAsistente';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { FileText, MessageSquare } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Travelyx Logistics</h1>
              <p className="text-sm text-slate-500">Sistema de Gestión Logística</p>
            </div>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900">Nueva Solicitud de Servicio</h2>
            <p className="text-slate-600 mt-1">
              Complete el formulario o use el asistente por chat para registrar su solicitud
            </p>
          </div>

          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="chat" className="gap-2 px-4">
                <MessageSquare className="size-4" />
                Asistente Chat
              </TabsTrigger>
              <TabsTrigger value="formulario" className="gap-2 px-4">
                <FileText className="size-4" />
                Formulario
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <ChatAsistente />
            </TabsContent>

            <TabsContent value="formulario">
              <FormularioSolicitud />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import api from "../api/axiosConfig";

const FormularioSolicitud = () => {
  const [formData, setFormData] = useState({
    incoterm: "",
    tipo_servicio: "",
    descripcion_material: "",
    valor_factura: "",
    divisa: "",
    peso_total: "",
    unidad_peso: "",
    numero_bultos: "",
    mercancia_adicionales: false,
    servicios_adicionales: {
      seguro: solicitud.servicios_adicionales?.includes('seguro') ?? false,
      maniobra_descarga: solicitud.servicios_adicionales?.includes('maniobras') ?? false,
    },
    direcciones: [
      {
        tipo: "origen",
        direccion_origen: "",
        direccion_destino: "",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "seguro" || name === "maniobra_descarga") {
      setFormData((prev) => ({
        ...prev,
        servicios_adicionales: {
          ...prev.servicios_adicionales,
          [name]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/solicitudes", formData);
      alert("Solicitud creada exitosamente");
      console.log(response.data);
    } catch (error) {
      if (error.response?.status === 422) {
        console.error("Errores de validación:", error.response.data.errors);
        alert("Revisa los campos, hay errores de validación.");
      } else {
        alert("Error al conectar con el servidor.");
      }
    }
  };

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h2>Crear Nueva Solicitud de Logística</h2>
      <form onSubmit={handleSubmit}>
        <input name="incoterm" placeholder="Incoterm (FOB/CIF)" value={formData.incoterm} onChange={handleChange} required />
        <input name="tipo_servicio" placeholder="Tipo de Servicio" value={formData.tipo_servicio} onChange={handleChange} required />
        <textarea name="descripcion_material" placeholder="Descripción del material" value={formData.descripcion_material} onChange={handleChange} required />
        <input type="number" name="valor_factura" placeholder="Valor Factura" value={formData.valor_factura} onChange={handleChange} required />
        
        {/* Checkbox para servicios adicionales */}
        <div>
          <label>
            <input type="checkbox" name="seguro" checked={formData.servicios_adicionales.seguro} onChange={handleChange} />
            Incluir Seguro
          </label>
        </div>

        <button type="submit">Guardar Solicitud</button>
      </form>
    </div>
  );
};

export default FormularioSolicitud;
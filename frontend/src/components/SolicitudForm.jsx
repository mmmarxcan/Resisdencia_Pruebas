import  { useState} from 'react';
import api from '../api/axiosConfig';

const FormularioSlicitud = () => {
    const [formData, setFormData] = useState({
        // sacamos los datos de nuestro requesto que esta en la ruta app/http/requests

        incoterm: '',
        tipo_servicio: '',
        descripcion_material: '',
        valor_factura: '',
        divisa: '',
        peso_total: '',
        unidad_peso: '',
        numero_bultos: '',
        mercancia_adicionales: false,
        
        servicos_adicionales: {
            seguro: false,
            maniobra_descarga: false
        },
        direccion: [{
            tipo: 'origen',
            direccion_origen: '',
            direccion_destino: ''
        }
        ]
        });
}

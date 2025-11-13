import api from './api.service'; // Importamos el 'axios' configurado
import { saveAs } from 'file-saver'; // Para la descarga

/**
 * Pide los datos de un reporte en formato JSON para los gráficos.
 * @param {string} endpoint - Ej: 'reports/filtrado/ventas-por-sucursal/'
 * @param {object} params - Ej: { fecha_inicio, fecha_fin }
 */
const getDatosReporteJSON = async (endpoint, params) => {
  try {
    const queryParams = {
      ...params,
      formato: 'json', // ¡Forzamos el formato JSON!
    };
    
    // Espera una respuesta JSON
    const response = await api.get(endpoint, { params: queryParams });
    return response.data; // Devuelve el array de datos [ { name: "...", total: ... } ]

  } catch (err) {
    console.error(`Error al obtener datos JSON de ${endpoint}:`, err);
    throw err.response?.data || new Error('Error de red al pedir datos de gráfico');
  }
};


/**
 * Descarga un reporte "clásico" (PDF, Excel, CSV).
 * @param {string} endpoint - Ej: 'reports/filtrado/ventas-por-producto/'
 * @param {object} params - Ej: { fecha_inicio, fecha_fin, formato: 'pdf' }
 * @param {string} filename - Ej: 'reporte_ventas.pdf'
 */
const descargarReporteFiltrado = async (endpoint, params, filename) => {
  try {
    // Espera una respuesta tipo 'blob' (archivo)
    const response = await api.get(endpoint, {
      params: params,
      responseType: 'blob', 
    });

    // Usa file-saver para iniciar la descarga
    saveAs(response.data, filename);
    return { success: true };

  } catch (err) {
    console.error(`Error al descargar ${filename}:`, err);
    // Intenta leer el error por si el 'blob' es en realidad un JSON de error
    try {
      const errorData = await err.response.data.text();
      const errorJson = JSON.parse(errorData);
      throw errorJson;
    } catch (parseErr) {
      throw new Error(err.response?.statusText || 'Error de red');
    }
  }
};

/**
 * Llama al generador NLP (POST) y descarga el archivo resultante.
 * @param {string} prompt - El texto del usuario
 */
const generarReporteNLP = async (prompt) => {
  try {
    const response = await api.post('reports/generar-con-nlp/', {
      prompt: prompt,
    }, {
      responseType: 'blob', // También esperamos un archivo
    });
    
    // Intenta obtener el nombre del archivo de la cabecera
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'reporte-ia.pdf'; // Default
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
    }

    saveAs(response.data, filename);
    return { success: true };

  } catch (err) {
    console.error('Error al generar reporte NLP:', err);
    try {
      const errorData = await err.response.data.text();
      const errorJson = JSON.parse(errorData);
      throw errorJson;
    } catch (parseErr) {
      throw new Error(err.response?.statusText || 'Error de red');
    }
  }
};

/**
 * Obtiene el ANÁLISIS de ventas (GET) y devuelve el JSON/texto.
 * @param {object} params - Ej: { fecha_inicio, fecha_fin }
 */
const obtenerAnalisisVentas = async (params) => {
  try {
    const response = await api.get('reports/analizar/ventas-por-producto/', {
      params: params,
    });
    return response.data; // Devuelve el objeto JSON { analysis: "..." }
  } catch (err) {
    console.error('Error al obtener análisis:', err);
    throw err.response?.data || new Error('Error de red');
  }
};


// Exportamos todo en un solo objeto 'reporteService'
export const reporteService = {
  getDatosReporteJSON,
  descargarReporteFiltrado,
  generarReporteNLP,
  obtenerAnalisisVentas,
};
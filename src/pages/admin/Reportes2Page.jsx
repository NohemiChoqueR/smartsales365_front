import React, { useState } from "react";
import api from "../../services/api.service";
import { saveAs } from "file-saver";

export default function Reportes2Page() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [notificacion, setNotificacion] = useState(null);
  const [data, setData] = useState([]);
  const [escuchandoVoz, setEscuchandoVoz] = useState(false);

  // ===================================================
  //   🔔 MOSTRAR NOTIFICACIÓN
  // ===================================================
  const mostrarNotificacion = (tipo, mensaje) => {
    setNotificacion({ tipo, mensaje });
    setTimeout(() => setNotificacion(null), 4000);
  };

  // ===================================================
  //   🎤 RECONOCIMIENTO DE VOZ
  // ===================================================
  const manejarVoz = () => {
    try {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "es-ES";
      recognition.continuous = false;
      recognition.interimResults = false;

      setEscuchandoVoz(true);

      recognition.onstart = () => {
        mostrarNotificacion('info', '🎤 Escuchando... Habla ahora');
      };

      recognition.onresult = (event) => {
        const texto = event.results[0][0].transcript;
        setPrompt(texto);
        mostrarNotificacion('success', `✅ Capturado: "${texto}"`);
        setEscuchandoVoz(false);
      };

      recognition.onerror = (event) => {
        mostrarNotificacion('error', '❌ Error en reconocimiento de voz');
        setEscuchandoVoz(false);
      };

      recognition.onend = () => {
        setEscuchandoVoz(false);
      };

      recognition.start();
    } catch (e) {
      mostrarNotificacion('error', '❌ Tu navegador no soporta reconocimiento de voz');
      setEscuchandoVoz(false);
    }
  };

  // ===================================================
  //   🔍 GENERAR REPORTE PARA MOSTRAR TABLA
  // ===================================================
  const generarVistaPrevia = async () => {
    if (!prompt.trim()) {
      mostrarNotificacion('error', '⚠️ Debes escribir una solicitud');
      return;
    }

    try {
      setLoading(true);
      setData([]);

      const response = await api.post("/reportes/generar/", { prompt });
      setData(response.data);
      mostrarNotificacion('success', '✅ Reporte generado exitosamente');
    } catch (error) {
      console.error(error);
      mostrarNotificacion('error', '❌ Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  //   📁 EXPORTAR PDF / EXCEL
  // ===================================================
  const descargarReporte = async (formato) => {
    if (!data || data.length === 0) {
      mostrarNotificacion('error', '⚠️ Primero genera el reporte');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/reportes/generar/",
        {
          prompt,
          formato_manual: formato,
        },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data]);
      saveAs(blob, formato === "excel" ? "reporte.xlsx" : "reporte.pdf");

      mostrarNotificacion('success', `✅ Reporte descargado (${formato.toUpperCase()})`);
    } catch (error) {
      console.error(error);
      mostrarNotificacion('error', '❌ No se pudo descargar el archivo');
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  //   Σ CALCULAR TOTAL AUTOMÁTICAMENTE
  // ===================================================
  const calcularTotal = () => {
    if (!data || data.length === 0) return 0;
    const first = data[0];

    const key = Object.keys(first).find((k) =>
      k.toLowerCase().includes("total")
    );

    if (!key) return 0;

    return data.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
  };

  // Ejemplos rápidos
  const ejemplos = [
    "Ventas del mes de abril",
    "Top 10 productos más vendidos",
    "Ventas por categoría del último trimestre",
    "Productos con baja rotación",
  ];

  const aplicarEjemplo = (ejemplo) => {
    setPrompt(ejemplo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 space-y-6">

      {/* ==============================
          NOTIFICACIÓN TOAST
      =============================== */}
      {notificacion && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in">
          <div className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl border-2 min-w-[350px] max-w-md ${
            notificacion.tipo === 'success' 
              ? 'bg-green-50 border-green-300' 
              : notificacion.tipo === 'error'
              ? 'bg-red-50 border-red-300'
              : 'bg-blue-50 border-blue-300'
          }`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              notificacion.tipo === 'success' 
                ? 'bg-green-500' 
                : notificacion.tipo === 'error'
                ? 'bg-red-500'
                : 'bg-blue-500'
            }`}>
              <span className="text-white text-xl">
                {notificacion.tipo === 'success' ? '✓' : notificacion.tipo === 'error' ? '✕' : 'ℹ'}
              </span>
            </div>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${
                notificacion.tipo === 'success' 
                  ? 'text-green-800' 
                  : notificacion.tipo === 'error'
                  ? 'text-red-800'
                  : 'text-blue-800'
              }`}>
                {notificacion.mensaje}
              </p>
            </div>
            <button
              onClick={() => setNotificacion(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ==============================
          HEADER HERO
      =============================== */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-3xl">📊</span>
            </div>
            <h1 className="text-4xl font-bold text-white">
              Reportes Inteligentes con IA
            </h1>
          </div>
          <p className="text-blue-100 text-lg ml-15">
            Genera reportes personalizados usando lenguaje natural y comandos de voz
          </p>
        </div>
      </div>

      {/* ==============================
          PANEL DE COMANDOS
      =============================== */}
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            💬 ¿Qué reporte necesitas?
          </label>
          <textarea
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 resize-none"
            rows={4}
            placeholder="Escribe tu consulta en lenguaje natural. Ejemplo: 'Muéstrame las ventas del mes de abril' o 'Top 10 productos más vendidos'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        {/* EJEMPLOS RÁPIDOS */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-600 mb-2">💡 Ejemplos rápidos:</p>
          <div className="flex flex-wrap gap-2">
            {ejemplos.map((ejemplo, idx) => (
              <button
                key={idx}
                onClick={() => aplicarEjemplo(ejemplo)}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs rounded-lg border border-indigo-200 transition-colors"
              >
                {ejemplo}
              </button>
            ))}
          </div>
        </div>

        {/* BOTONES PRINCIPALES */}
        <div className="flex flex-wrap gap-3">

          {/* GENERAR REPORTE */}
          <button
            onClick={generarVistaPrevia}
            disabled={loading}
            className={`flex-1 min-w-[200px] px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${
              loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generando...
              </>
            ) : (
              <>
                <span className="text-xl">🔍</span>
                Generar Reporte
              </>
            )}
          </button>

          {/* DESCARGAR PDF */}
          <button
            onClick={() => descargarReporte("pdf")}
            disabled={loading || data.length === 0}
            className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 ${
              loading || data.length === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
            }`}
          >
            <span className="text-xl">📄</span>
            PDF
          </button>

          {/* DESCARGAR EXCEL */}
          <button
            onClick={() => descargarReporte("excel")}
            disabled={loading || data.length === 0}
            className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 ${
              loading || data.length === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
            }`}
          >
            <span className="text-xl">📗</span>
            Excel
          </button>

          {/* COMANDO DE VOZ */}
          <button
            onClick={manejarVoz}
            disabled={escuchandoVoz}
            className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 ${
              escuchandoVoz
                ? 'bg-purple-400 animate-pulse'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
            } text-white`}
          >
            <span className="text-xl">🎤</span>
            {escuchandoVoz ? 'Escuchando...' : 'Hablar'}
          </button>
        </div>

      </div>

      {/* ==============================
          LOADING ELEGANTE
      =============================== */}
      {loading && (
        <div className="bg-white shadow-xl rounded-2xl p-12 border border-gray-200">
          <div className="text-center">
            <div className="relative mx-auto w-20 h-20 mb-6">
              <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Generando tu reporte...</h3>
            <p className="text-gray-600">La IA está procesando tu solicitud</p>
          </div>
        </div>
      )}

      {/* ==============================
          RESULTADOS - TABLA MEJORADA
      =============================== */}
      {!loading && data.length > 0 && (
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">

          {/* Header de resultados */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-3xl">📋</span>
                Resultados del Reporte
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {data.length} registro{data.length !== 1 ? 's' : ''} encontrado{data.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Estadísticas rápidas */}
            <div className="text-right">
              <p className="text-xs text-gray-500">Total General</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Bs {calcularTotal().toLocaleString("es-BO")}
              </p>
            </div>
          </div>

          {/* Tabla con scroll */}
          <div className="overflow-x-auto border-2 border-gray-100 rounded-xl">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-indigo-200">
                      #
                    </th>
                    {Object.keys(data[0]).map((col, i) => (
                      <th 
                        key={i} 
                        className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-indigo-200"
                      >
                        {col.replace(/__/g, " ").replace(/_/g, " ")}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {data.map((fila, idx) => (
                    <tr 
                      key={idx} 
                      className={`transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-indigo-50`}
                    >
                      <td className="px-4 py-3 text-gray-600 font-semibold">
                        {idx + 1}
                      </td>
                      {Object.values(fila).map((val, i) => (
                        <td key={i} className="px-4 py-3 text-gray-800">
                          {val === null || val === "" ? (
                            <span className="text-gray-400 italic">N/A</span>
                          ) : (
                            String(val)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer con resumen */}
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-xl">ℹ️</span>
                <span>Usa los botones de exportación para descargar este reporte</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total calculado</p>
                <p className="text-xl font-bold text-indigo-600">
                  Σ Bs {calcularTotal().toLocaleString("es-BO")}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ==============================
          ESTADO VACÍO
      =============================== */}
      {!loading && data.length === 0 && (
        <div className="bg-white shadow-xl rounded-2xl p-12 border-2 border-dashed border-gray-300 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No hay reportes generados
          </h3>
          <p className="text-gray-500 mb-6">
            Escribe tu consulta arriba y presiona "Generar Reporte" para comenzar
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-xl">💬</span>
              <span>Escribe tu consulta</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎤</span>
              <span>O usa comando de voz</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span>La IA hará el resto</span>
            </div>
          </div>
        </div>
      )}

      {/* Estilos para animación */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>

    </div>
  );
}
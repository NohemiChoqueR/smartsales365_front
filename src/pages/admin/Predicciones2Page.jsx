import React, { useEffect, useState } from "react";
import api from "../../services/api.service";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Area, AreaChart
} from "recharts";

export default function Predicciones2Page() {

  const [dias, setDias] = useState(30);

  const [predicciones, setPredicciones] = useState([]);
  const [tendencias, setTendencias] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [insights, setInsights] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingRetrain, setLoadingRetrain] = useState(false);
  
  // Estados para notificaciones
  const [notificacion, setNotificacion] = useState(null);
  const [vistaGrafico, setVistaGrafico] = useState("linea"); // linea, area, barra

  // =============================
  // 🔔 MOSTRAR NOTIFICACIÓN
  // =============================
  const mostrarNotificacion = (tipo, mensaje) => {
    setNotificacion({ tipo, mensaje });
    setTimeout(() => setNotificacion(null), 5000); // Desaparecer después de 5 segundos
  };

  // =============================
  // 🔄 RE-ENTRENAR MODELO
  // =============================
  const retrainModel = async () => {
    setLoadingRetrain(true);
    try {
      const res = await api.post("/prediccion/reentrenar/");
      mostrarNotificacion('success', '✅ Modelo reentrenado correctamente. Los datos se han actualizado.');
      cargarTodo();
    } catch (error) {
      mostrarNotificacion('error', '❌ Error al re-entrenar el modelo. Por favor, intenta nuevamente.');
    }
    setLoadingRetrain(false);
  };

  // =============================
  // 🔍 CARGAR TODA LA DATA
  // =============================
  const cargarTodo = async () => {
    setLoading(true);

    try {
      // --- Predicciones / Tendencias / Ranking ---
      const res = await api.get(`/prediccion/tendencias/?dias=${dias}`);
      setPredicciones(res.data.predicciones || []);
      setTendencias(res.data.tendencias?.diaria || []);
      setRanking(res.data.tendencias?.ranking || []);
      setMetadata(res.data.metadata || {});

      // --- Insights IA ---
      const resInsights = await api.get("/prediccion/insights/");
      setInsights(resInsights.data || null);

    } catch (err) {
      console.error("❌ Error:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  // Componentes de tooltips personalizados
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-xl border-2 border-indigo-200">
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          <p className="text-lg font-bold text-indigo-600">
            Bs {payload[0].value.toLocaleString('es-BO')}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
          </div>
          <p className="text-xl font-semibold text-gray-700 mt-4">Cargando predicciones IA...</p>
          <p className="text-sm text-gray-500 mt-2">Analizando datos históricos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 space-y-6">

      {/* ==============================
          NOTIFICACIÓN TOAST
      =============================== */}
      {notificacion && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in">
          <div className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl border-2 min-w-[350px] max-w-md ${
            notificacion.tipo === 'success' 
              ? 'bg-green-50 border-green-300' 
              : 'bg-red-50 border-red-300'
          }`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              notificacion.tipo === 'success' 
                ? 'bg-green-500' 
                : 'bg-red-500'
            }`}>
              <span className="text-white text-xl">
                {notificacion.tipo === 'success' ? '✓' : '✕'}
              </span>
            </div>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${
                notificacion.tipo === 'success' 
                  ? 'text-green-800' 
                  : 'text-red-800'
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
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-3xl">🤖</span>
              </div>
              <h1 className="text-4xl font-bold text-white">
                Predicciones Avanzadas con IA
              </h1>
            </div>
            <p className="text-indigo-100 text-lg ml-15">
              Análisis predictivo basado en Machine Learning para optimizar tus ventas
            </p>
          </div>

          <button
            onClick={retrainModel}
            disabled={loadingRetrain}
            className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 ${
              loadingRetrain 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-white text-indigo-600 hover:bg-indigo-50"
            }`}
          >
            {loadingRetrain ? (
              <>
                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                Re-Entrenando...
              </>
            ) : (
              <>
                <span className="text-xl">🔄</span>
                Re-Entrenar Modelo
              </>
            )}
          </button>
        </div>
      </div>

      {/* ==============================
          KPIS DEL MODELO - MEJORADO
      =============================== */}
      {metadata && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">
                RMSE
              </div>
            </div>
            <h4 className="text-sm text-gray-500 mb-1">Precisión del Modelo</h4>
            <p className="text-3xl font-bold text-indigo-600 mb-2">
              ± {metadata.rmse?.toFixed(2)} Bs
            </p>
            <p className="text-xs text-gray-600">{metadata.interpretacion}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <div className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">
                Actualizado
              </div>
            </div>
            <h4 className="text-sm text-gray-500 mb-1">Último Entrenamiento</h4>
            <p className="text-2xl font-bold text-purple-600 mb-2">
              {metadata.fecha_entrenamiento}
            </p>
            <p className="text-xs text-gray-600">Modelo entrenado con datos históricos</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-pink-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-xs font-semibold">
                Predicción
              </div>
            </div>
            <h4 className="text-sm text-gray-500 mb-1">Periodo Proyectado</h4>
            <p className="text-3xl font-bold text-pink-600 mb-2">
              {dias} días
            </p>
            <p className="text-xs text-gray-600">Horizonte de predicción configurado</p>
          </div>

        </div>
      )}

      {/* ==============================
          INSIGHTS IA - REDISEÑADO
      =============================== */}
      {insights && (
        <div className="bg-gradient-to-br from-white to-indigo-50 p-8 rounded-2xl shadow-xl border border-indigo-100">

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔮</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Insights Inteligentes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-5 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">📈</span>
                <div className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs font-semibold">
                  MEJOR
                </div>
              </div>
              <h4 className="text-green-100 text-xs mb-1 font-medium">Día Más Fuerte</h4>
              <p className="text-2xl font-bold mb-1">{insights.dia_fuerte.nombre}</p>
              <p className="text-green-100 text-sm font-semibold">
                Bs {insights.dia_fuerte.promedio_bs.toLocaleString("es-BO")}
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-pink-600 p-5 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">📉</span>
                <div className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs font-semibold">
                  DÉBIL
                </div>
              </div>
              <h4 className="text-red-100 text-xs mb-1 font-medium">Día Más Débil</h4>
              <p className="text-2xl font-bold mb-1">{insights.dia_debil.nombre}</p>
              <p className="text-red-100 text-sm font-semibold">
                Bs {insights.dia_debil.promedio_bs.toLocaleString("es-BO")}
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-5 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">🌟</span>
                <div className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs font-semibold">
                  TOP
                </div>
              </div>
              <h4 className="text-indigo-100 text-xs mb-1 font-medium">Mes Más Fuerte</h4>
              <p className="text-2xl font-bold mb-1">{insights.mes_fuerte.nombre}</p>
              <p className="text-indigo-100 text-sm font-semibold">
                Bs {insights.mes_fuerte.promedio_bs.toLocaleString("es-BO")}
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-5 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">⚠️</span>
                <div className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs font-semibold">
                  BAJO
                </div>
              </div>
              <h4 className="text-amber-100 text-xs mb-1 font-medium">Mes Más Débil</h4>
              <p className="text-2xl font-bold mb-1">{insights.mes_debil.nombre}</p>
              <p className="text-amber-100 text-sm font-semibold">
                Bs {insights.mes_debil.promedio_bs.toLocaleString("es-BO")}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-5 rounded-xl border-2 border-purple-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h4 className="text-purple-800 font-bold text-lg mb-1">
                  Estacionalidad Detectada: {insights.estacionalidad}%
                </h4>
                <p className="text-purple-700 text-sm">
                  Este porcentaje indica qué tan fuerte es la influencia de factores temporales (días de la semana, meses) 
                  en el comportamiento de tus ventas. Un valor alto significa patrones predecibles.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ==============================
          FILTROS Y CONFIGURACIÓN
      =============================== */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">

        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          Configuración de Predicción
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📅 Horizonte de Predicción
            </label>
            <select 
              value={dias} 
              onChange={e => setDias(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-gray-50"
            >
              <option value="7">Próximos 7 días</option>
              <option value="15">Próximos 15 días</option>
              <option value="30">Próximos 30 días</option>
              <option value="60">Próximos 60 días</option>
              <option value="90">Próximos 90 días</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              onClick={cargarTodo}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span className="text-xl">✨</span>
              Generar Predicción
            </button>
          </div>
        </div>
      </div>

      {/* ==============================
          GRÁFICOS PRINCIPALES
      =============================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* --- Predicción Diaria --- */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">📅</span>
                Predicción Diaria
              </h3>
              <p className="text-sm text-gray-600">Proyección de ventas día a día</p>
            </div>
            
            {/* Selector de tipo de gráfico */}
            <div className="flex gap-2">
              <button
                onClick={() => setVistaGrafico("linea")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  vistaGrafico === "linea"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Línea
              </button>
              <button
                onClick={() => setVistaGrafico("area")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  vistaGrafico === "area"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Área
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            {vistaGrafico === "area" ? (
              <AreaChart data={predicciones}>
                <defs>
                  <linearGradient id="colorPrediccion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="fecha" tick={{ fontSize: 11 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 11 }} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="prediccion_total_bs" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorPrediccion)" 
                />
              </AreaChart>
            ) : (
              <LineChart data={predicciones}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="fecha" tick={{ fontSize: 11 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 11 }} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="prediccion_total_bs" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  dot={{ fill: "#4f46e5", r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* --- Tendencias Globales --- */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">🌍</span>
                Tendencias Globales
              </h3>
              <p className="text-sm text-gray-600">Análisis agregado por IA</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={tendencias}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="fecha" tick={{ fontSize: 11 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 11 }} stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="prediccion_total_bs" 
                fill="#10b981" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ==============================
          RANKING PRODUCTOS - REDISEÑADO
      =============================== */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              Productos con Mayor Tendencia
            </h3>
            <p className="text-sm text-gray-600">Los productos con mayor proyección de crecimiento</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Total Productos</p>
            <p className="text-2xl font-bold text-cyan-600">{ranking.length}</p>
          </div>
        </div>

        {ranking.length > 0 ? (
          <div className="space-y-3">
            {ranking.map((item, index) => {
              const maxFuerza = Math.max(...ranking.map(r => r.fuerza));
              const porcentaje = (item.fuerza / maxFuerza) * 100;
              
              // Colores por posición
              const getColor = (pos) => {
                if (pos === 0) return 'from-yellow-400 to-amber-500';
                if (pos === 1) return 'from-gray-300 to-gray-400';
                if (pos === 2) return 'from-orange-400 to-amber-600';
                return 'from-cyan-400 to-blue-500';
              };

              const getMedal = (pos) => {
                if (pos === 0) return '🥇';
                if (pos === 1) return '🥈';
                if (pos === 2) return '🥉';
                return '⭐';
              };

              return (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{getMedal(index)}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm group-hover:text-cyan-600 transition-colors">
                          {item.producto}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <span className="text-lg font-bold text-cyan-600">
                        {item.fuerza.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">pts</span>
                    </div>
                  </div>
                  
                  {/* Barra de progreso */}
                  <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getColor(index)} rounded-full transition-all duration-1000 ease-out shadow-md`}
                      style={{ width: `${porcentaje}%` }}
                    >
                      <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-6xl mb-3 block">📊</span>
            <p className="text-gray-500">No hay datos de tendencias disponibles</p>
          </div>
        )}

        {/* Leyenda */}
        {ranking.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500"></div>
                <span>Top 1</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-300 to-gray-400"></div>
                <span>Top 2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-amber-600"></div>
                <span>Top 3</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"></div>
                <span>Otros</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==============================
          TABLA DETALLADA
      =============================== */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              Datos Detallados de Predicción
            </h3>
            <p className="text-sm text-gray-600 mt-1">Desglose completo de las proyecciones</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Total Registros</p>
            <p className="text-2xl font-bold text-indigo-600">{predicciones.length}</p>
          </div>
        </div>

        <div className="overflow-y-auto max-h-96 border-2 border-gray-100 rounded-xl">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">#</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700">Fecha</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">Ventas Previstas (Bs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {predicciones.map((item, i) => (
                <tr key={i} className="hover:bg-indigo-50 transition-colors">
                  <td className="px-6 py-4 text-gray-600 font-medium">{i + 1}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{item.fecha}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-indigo-600 font-bold text-lg">
                      Bs {item.prediccion_total_bs.toLocaleString("es-BO")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==============================
          FOOTER INFO
      =============================== */}
      <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-6 rounded-xl border-2 border-indigo-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">
              Sobre las Predicciones con IA
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              Nuestro modelo de Machine Learning analiza patrones históricos de ventas, estacionalidad, 
              tendencias y comportamiento de productos para generar predicciones precisas. El RMSE (Root Mean Square Error) 
              indica el margen de error promedio. Un modelo entrenado recientemente con suficientes datos históricos 
              proporciona predicciones más confiables. Usa estas proyecciones para optimizar inventario, 
              planificar campañas y tomar decisiones estratégicas.
            </p>
          </div>
        </div>
      </div>

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
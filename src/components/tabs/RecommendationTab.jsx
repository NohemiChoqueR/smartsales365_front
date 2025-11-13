import React, { useState } from 'react';
import { predictionService } from '../../services/prediction.service'; // Ajusta la ruta
import { useProductos } from '../../hooks/useProducto'; // ¡Usamos el hook de productos!
import { ShoppingBagIcon } from '@heroicons/react/24/outline'; // O cualquier ícono

// Componente pequeño para la lista de resultados
const RecommendationItem = ({ productName, probability }) => (
  <li className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm border border-gray-200">
    <span className="font-medium text-gray-800">{productName}</span>
    <span className="text-sm font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
      {probability}
    </span>
  </li>
);

export const RecommendationTab = () => {
  // 1. Usamos el hook para obtener los productos para el <select>
  const { productos, loading: loadingProductos } = useProductos();

  // 2. Estado para el producto seleccionado
  const [selectedProductId, setSelectedProductId] = useState('');
  
  // 3. Estado para el resultado de la API
  const [prediction, setPrediction] = useState({ data: null, loading: false, error: null });

  // 4. Handler para el botón "Predecir"
  const handlePredict = async () => {
    if (!selectedProductId) {
      setPrediction({ data: null, loading: false, error: 'Por favor, selecciona un producto.' });
      return;
    }
    
    setPrediction({ data: null, loading: true, error: null });
    try {
      const data = await predictionService.getRecommendations(selectedProductId);
      setPrediction({ data: data, loading: false, error: null });
    } catch (err) {
      setPrediction({ data: null, loading: false, error: 'Error al calcular la recomendación.' });
    }
  };

  // 5. Helper para obtener el nombre del producto desde el ID
  // (¡Exactamente por qué queríamos usar el hook!)
  const getProductName = (id) => {
    if (!id || productos.length === 0) return `Producto ${id}`;
    const prod = productos.find(p => p.id === parseInt(id));
    return prod ? prod.nombre : `Producto ${id}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* Columna Izquierda: Parámetros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Parámetros de Recomendación
        </h3>
        
        {/* Selector de Producto Base */}
        <div>
          <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 mb-2">
            Producto Base
          </label>
          <select
            id="product-select"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            disabled={loadingProductos}
          >
            <option value="">{loadingProductos ? 'Cargando productos...' : '-- Elegir Producto --'}</option>
            {productos.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.nombre}
              </option>
            ))}
          </select>
        </div>
        
        {/* Botón de Acción */}
        <button
          onClick={handlePredict}
          disabled={prediction.loading || !selectedProductId}
          className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm
                     hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                     disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {prediction.loading ? 'Buscando...' : 'Obtener Recomendaciones'}
        </button>
      </div>
      
      {/* Columna Derecha: Resultados (¡Personalizada para una lista!) */}
      <div className="bg-slate-50 rounded-lg shadow-inner border border-gray-200 p-6 h-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Resultado de la Recomendación
        </h3>

        {/* Estado de Carga */}
        {prediction.loading && (
          <div className="text-center text-gray-600 animate-pulse">
            Calculando recomendaciones...
          </div>
        )}

        {/* Estado de Error */}
        {prediction.error && (
          <p className="text-center text-red-600 font-medium">{prediction.error}</p>
        )}

        {/* Estado Inicial (Sin datos) */}
        {!prediction.loading && !prediction.error && !prediction.data && (
          <p className="text-center text-gray-500">Selecciona un producto y presiona "Obtener Recomendaciones".</p>
        )}
        
        {/* Estado con Datos */}
        {prediction.data && (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Productos recomendados para comprar junto con:
              <br />
              <strong className="text-gray-900 text-base">
                {getProductName(prediction.data.producto_consultado)}
              </strong>
            </p>
            <ul className="space-y-3">
              {prediction.data.recomendaciones.map((rec) => (
                <RecommendationItem
                  key={rec.producto_id_recomendado}
                  productName={getProductName(rec.producto_id_recomendado)}
                  probability={rec.probabilidad}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
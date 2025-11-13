import React, { useState } from 'react';
import { useProductos } from '../../hooks/useProducto'; // Ajusta la ruta
import { predictionService } from '../../services/prediction.service'; // Ajusta la ruta
import { PredictionResultDisplay } from '../PredictionResultDisplay'; // Ajusta la ruta

export const DemandPredictionTab = () => {
  const { productos, loading: loadingProductos } = useProductos();
  const [selectedProductId, setSelectedProductId] = useState('');
  const [prediction, setPrediction] = useState({ data: null, loading: false, error: null });

  const handlePredict = async () => {
    if (!selectedProductId) {
      setPrediction({ data: null, loading: false, error: 'Por favor, selecciona un producto.' });
      return;
    }
    
    setPrediction({ data: null, loading: true, error: null });
    try {
      const data = await predictionService.predictDemand(selectedProductId);
      setPrediction({ data: data, loading: false, error: null });
    } catch (err) {
      setPrediction({ data: null, loading: false, error: 'Error al calcular la predicción.' });
    }
  };

  const getProductName = () => {
    if (!selectedProductId) return '';
    const prod = productos.find(p => p.id === parseInt(selectedProductId));
    return prod ? prod.nombre : '';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Parámetros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Parámetros de Demanda
        </h3>
        
        <div>
          <label htmlFor="demand-product" className="block text-sm font-medium text-gray-700 mb-2">
            Producto
          </label>
          <select
            id="demand-product"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            disabled={loadingProductos}
          >
            <option value="">{loadingProductos ? 'Cargando...' : '-- Elegir Producto --'}</option>
            {productos.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.nombre}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handlePredict}
          disabled={prediction.loading || !selectedProductId}
          className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm
                     hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                     disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {prediction.loading ? 'Prediciendo...' : 'Predecir Demanda'}
        </button>
      </div>
      
      {/* Resultados */}
      <PredictionResultDisplay
        title={`Demanda estimada para "${getProductName()}" (Próx. semana)`}
        value={prediction.data ? prediction.data['prediccion_proxima_semana (unidades)'] : null}
        unit="Unidades"
        analysis={prediction.data ? `Datos de entrada: ${prediction.data.datos_usados_para_predecir.ventas_reales_ultimos_7_dias} ventas (últ. 7 días).` : null}
        isLoading={prediction.loading}
        error={prediction.error}
      />
    </div>
  );
};
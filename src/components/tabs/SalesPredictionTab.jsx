import React, { useState } from 'react';
// 1. --- ¡BORRAMOS EL HOOK! ---
// import { useCategorias } from '../../hooks/useCategorias'; 

// 2. --- ¡IMPORTAMOS LA "TRAMPA"! ---
import { allSubcategories } from '../../utils/constants'; // Ajusta esta ruta
import { predictionService } from '../../services/prediction.service';
import { PredictionResultDisplay } from '../PredictionResultDisplay';

export const SalesPredictionTab = () => {
  
  // 3. --- ¡USAMOS LOS DATOS ESTÁTICOS! ---
  // Filtramos solo las activas, por si acaso.
  const subcategoriasVisibles = allSubcategories.filter(sub => sub.esta_activo);
  
  // (Opcional) Puedes ver en la consola si se cargaron
  console.log("Subcategorías estáticas cargadas:", subcategoriasVisibles);

  // El resto de tu componente sigue EXACTAMENTE IGUAL
  
  // Estado para los parámetros
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');
  
  // Estado para el resultado
  const [prediction, setPrediction] = useState({ data: null, loading: false, error: null });

  // 4. --- ¡BORRAMOS EL useEffect! ---
  // Ya no es necesario, porque los datos están disponibles al instante.
  // React.useEffect(() => { ... }, []);

  // Handler para el botón
  const handlePredict = async () => {
    if (!selectedSubcategoryId) {
      setPrediction({ data: null, loading: false, error: 'Por favor, selecciona una subcategoría.' });
      return;
    }
    
    setPrediction({ data: null, loading: true, error: null });
    try {
      const data = await predictionService.predictSalesCategory(selectedSubcategoryId);
      setPrediction({ data: data, loading: false, error: null });
    } catch (err) {
      setPrediction({ data: null, loading: false, error: 'Error al calcular la predicción.' });
    }
  };

  // Obtenemos el nombre para el título del resultado
  const getSubcategoryName = () => {
    if (!selectedSubcategoryId) return '';
    // Usamos nuestro array estático para buscar el nombre
    const subcat = subcategoriasVisibles.find(s => s.id === parseInt(selectedSubcategoryId));
    return subcat ? subcat.nombre : '';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Columna Izquierda: Parámetros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Parámetros de Ventas
        </h3>
        
        {/* Selector de Subcategoría */}
        <div>
          <label htmlFor="sales-subcategory" className="block text-sm font-medium text-gray-700 mb-2">
            Subcategoría
          </label>
          <select
            id="sales-subcategory"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={selectedSubcategoryId}
            onChange={(e) => setSelectedSubcategoryId(e.target.value)}
          >
            {/* 5. --- ¡ESTO AHORA FUNCIONARÁ! --- */}
            <option value="">-- Elegir Subcategoría --</option>
            {subcategoriasVisibles.map((subcat) => (
              <option key={subcat.id} value={subcat.id}>
                {subcat.nombre}
              </option>
            ))}
          </select>
        </div>
        
        {/* Botón de Acción */}
        <button
          onClick={handlePredict}
          disabled={prediction.loading || !selectedSubcategoryId}
          className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm
                     hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                     disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {prediction.loading ? 'Prediciendo...' : 'Predecir Ventas'}
        </button>
      </div>
      
      {/* Columna Derecha: Resultados */}
      <PredictionResultDisplay
        title={`Ventas estimadas para "${getSubcategoryName()}" (Próx. mes)`}
        value={prediction.data ? prediction.data['prediccion_proximo_mes (unidades)'] : null}
        unit="Unidades"
        analysis={prediction.data ? `Datos de entrada: ${prediction.data.datos_usados_para_predecir.ventas_reales_mes_pasado} ventas (mes pasado).` : null}
        isLoading={prediction.loading}
        error={prediction.error}
      />
    </div>
  );
};
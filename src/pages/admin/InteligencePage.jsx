import React, { useState } from 'react';
import { CpuChipIcon } from '@heroicons/react/24/outline';

// Importa los componentes de las pestañas que acabamos de crear
import { SalesPredictionTab } from '../../components/tabs/SalesPredictionTab';
import { DemandPredictionTab } from '../../components/tabs/DemandPredictionTab';
import { RecommendationTab } from '../../components/tabs/RecommendationTab';
// import { RecommendationTab } from './tabs/RecommendationTab'; // (Aún no la creamos, pero la agregamos aquí)

// --- ¡Falta crear este componente! ---


// Un componente pequeño para los botones de las pestañas
const TabButton = ({ title, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 text-sm font-semibold whitespace-nowrap
                ${isActive
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
  >
    {title}
  </button>
);


const InteligencePage = () => {
  const [activeTab, setActiveTab] = useState('sales'); // 'sales', 'demand', 'recommend'

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'sales':
        return <SalesPredictionTab />;
      case 'demand':
        return <DemandPredictionTab />;
      case 'recommend':
        return <RecommendationTab />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* 1. Título (como en tu imagen) */}
      <div className="flex items-center space-x-3 mb-6">
        <CpuChipIcon className="h-9 w-9 text-indigo-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Centro de Inteligencia
          </h1>
          <p className="text-gray-600">
            Utiliza los modelos de IA para predicción y recomendación.
          </p>
        </div>
      </div>
      
      {/* 2. Navegación de Pestañas */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex -mb-px space-x-4">
          <TabButton
            title="Predicción de Ventas"
            isActive={activeTab === 'sales'}
            onClick={() => setActiveTab('sales')}
          />
          <TabButton
            title="Predicción de Demanda"
            isActive={activeTab === 'demand'}
            onClick={() => setActiveTab('demand')}
          />
          <TabButton
            title="Recomendación"
            isActive={activeTab === 'recommend'}
            onClick={() => setActiveTab('recommend')}
          />
        </nav>
      </div>

      {/* 3. Contenido de la Pestaña Activa */}
      <div>
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default InteligencePage;
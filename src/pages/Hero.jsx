import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Datos de las Campañas (Igual que antes, en JS) ---

const today = new Date();

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const formatDate = (date) => {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const campaniasData = [
  { nombre: 'Campaña Verano', desc: 'Ofertas de verano', inicio: today, fin: addDays(today, 30) },
  { nombre: 'Cyber Monday', desc: 'Descuentos Tech', inicio: addDays(today, 40), fin: addDays(today, 47) },
  { nombre: 'Navidad 2025', desc: 'Especiales de Navidad', inicio: addDays(today, 60), fin: addDays(today, 90) },
];

const gradients = [
  'from-blue-500 to-indigo-600',
  'from-green-500 to-teal-600',
  'from-red-500 to-orange-600',
  'from-purple-500 to-pink-600',
];

const slides = campaniasData.map((campaña, index) => ({
  id: index + 1,
  nombre: campaña.nombre,
  desc: campaña.desc,
  inicio: formatDate(campaña.inicio),
  fin: formatDate(campaña.fin),
  cta: 'Compra ya!',
  link: '/catalogo',
  bgGradient: gradients[index % gradients.length],
}));

// --- Componente del Carrusel (Sin Swiper) ---

export const HeroCarousel = () => {
  // 1. Estado para la diapositiva activa
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Ref para el temporizador del autoplay
  const autoplayTimer = useRef(null);

  // 2. Funciones de Navegación (usando 'useCallback' para optimizar)
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // 3. Lógica de Autoplay
  const startAutoplay = useCallback(() => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
    }
    autoplayTimer.current = setInterval(() => {
      nextSlide();
    }, 4000); // Cambia cada 4 segundos
  }, [nextSlide]);

  const stopAutoplay = () => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
    }
  };

  // Iniciar autoplay al montar y limpiar al desmontar
  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay]);
  
  // Reiniciar el timer si el usuario navega manualmente
  const handleManualNav = (navFunction) => {
    stopAutoplay();
    navFunction();
    startAutoplay();
  };


  return (
    <div 
      className="relative w-full h-[50vh] md:h-[60vh] bg-neutral-medium overflow-hidden rounded-lg shadow-2xl mb-12"
      onMouseEnter={stopAutoplay}  // Pausar al pasar el mouse
      onMouseLeave={startAutoplay} // Reanudar al quitar el mouse
    >
      
      {/* Contenedor de Diapositivas */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full bg-gradient-to-r ${slide.bgGradient} transition-opacity duration-1000 ease-in-out`}
            // 4. Lógica de Fade: Muestra solo la activa
            style={{
              opacity: index === currentSlide ? 1 : 0,
              zIndex: index === currentSlide ? 10 : 0, // Asegura que la activa esté encima
            }}
          >
            {/* Contenido (solo renderizamos el contenido si la diapositiva está activa) */}
            {index === currentSlide && (
              <div 
                className="relative z-10 h-full flex items-center justify-center text-center"
                // 5. Truco de la 'key': Fuerza la re-animación del contenido
                key={currentSlide} 
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  {/* Contenido con animaciones (igual que antes) */}
                  <div className="max-w-3xl mx-auto animate-fade-in">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white mb-4 leading-tight drop-shadow-2xl animate-slide-up">
                      {slide.nombre}
                    </h1>
                    <p className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-6 drop-shadow-lg animate-slide-up animation-delay-200">
                      {slide.desc}
                    </p>
                    <div className="flex items-center justify-center gap-3 text-lg md:text-xl text-white/90 mb-8 animate-slide-up animation-delay-300">
                      <CalendarDays className="inline-block" size={20} />
                      <span>{slide.inicio}</span>
                      <span>-</span>
                      <span>{slide.fin}</span>
                    </div>
                    <Link
                      to={slide.link}
                      className="inline-block px-8 py-4 bg-white text-gray-800 font-semibold rounded-lg hover:bg-white/90 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/50 animate-slide-up animation-delay-400"
                    >
                      {slide.cta}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botones de Navegación */}
      <button 
        onClick={() => handleManualNav(prevSlide)}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-300 group shadow-xl hover:shadow-2xl"
      >
        <ChevronLeft className="text-gray-800" size={24} />
      </button>
      <button 
        onClick={() => handleManualNav(nextSlide)}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-300 group shadow-xl hover:shadow-2xl"
      >
        <ChevronRight className="text-gray-800" size={24} />
      </button>

      {/* Paginación */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-1">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleManualNav(() => goToSlide(index))}
            className={`inline-block w-3 h-3 rounded-full mx-1.5 cursor-pointer transition-all duration-300 hover:bg-white/70
              ${index === currentSlide ? '!w-8 bg-white scale-110' : 'bg-white/50'}
            `}
          />
        ))}
      </div>

      {/* CSS para animaciones (igual que antes) */}
      <style>{`
        .animate-fade-in { animation: fadeIn 1s ease-out; }
        .animate-slide-up { animation: slideUp 0.8s ease-out; }
        .animation-delay-200 { animation-delay: 0.2s; opacity: 0; animation-fill-mode: forwards; }
        .animation-delay-300 { animation-delay: 0.3s; opacity: 0; animation-fill-mode: forwards; }
        .animation-delay-400 { animation-delay: 0.4s; opacity: 0; animation-fill-mode: forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};
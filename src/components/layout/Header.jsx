// En Header.js
import React from 'react';
import { ChevronRight, Home, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ breadcrumb = [] }) => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Efecto para detectar el tema del sistema
  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      html.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  const handleBreadcrumbClick = (index) => {
    if (index < breadcrumb.length - 1) {
      navigate(-(breadcrumb.length - 1 - index));
    }
  };

  const handleHomeClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="sticky top-0 z-10" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="px-6 py-2.5 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between">
          {/* Breadcrumb */}
          {breadcrumb.length > 0 && (
            <nav className="flex items-center space-x-2 text-sm">
              <button 
                onClick={handleHomeClick}
                className="flex items-center hover:opacity-70 transition-opacity"
              >
                <Home size={16} style={{ color: 'var(--color-text-secondary)' }} />
              </button>
              {breadcrumb.map((item, index) => (
                <React.Fragment key={index}>
                  <ChevronRight size={16} style={{ color: 'var(--color-text-secondary)' }} />
                  {index === breadcrumb.length - 1 ? (
                    <span style={{ color: 'var(--color-text-primary)' }} className="font-medium">
                      {item}
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleBreadcrumbClick(index)}
                      style={{ color: 'var(--color-text-secondary)' }} 
                      className="hover:underline transition-colors"
                    >
                      {item}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
          
          {/* Selector de Tema */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors"
            style={{
              color: 'var(--color-text-secondary)',
              backgroundColor: 'var(--color-surface)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--color-primary)';
              e.target.style.color = 'var(--color-background)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--color-surface)';
              e.target.style.color = 'var(--color-text-secondary)';
            }}
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
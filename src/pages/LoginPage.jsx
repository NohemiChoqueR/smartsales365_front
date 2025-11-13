// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserFromToken } from '../utils/auth.utils';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      const userData = getUserFromToken();
      
      if (userData && userData.role === 'ADMIN') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/home';
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="max-w-md w-full space-y-8">
        
        {/* Header corregido */}
        <div className="text-center">
          <h2 
            className="text-3xl font-bold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Smart Sales 365
          </h2>
          <h1 
            className="mt-3 text-sm leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Ingrese su correo electrónico a continuación para iniciar sesión en su cuenta
          </h1>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div 
              className="px-4 py-3 rounded-lg text-sm text-center"
              style={{ 
                backgroundColor: 'var(--color-error-bg)',
                color: 'var(--color-error)',
                border: '1px solid var(--color-error)'
              }}
            >
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Campo Email - CORREGIDO */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-left mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username email"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                inputMode="email"
                required
                className="appearance-none block w-full px-4 py-3 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 text-base transition duration-200 select-text"
                style={{
                  backgroundColor: 'var(--color-background)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-border-focus)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(107, 114, 128, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="ejemplo@smartsales.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Campo Contraseña - CORREGIDO */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-left mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none block w-full px-4 py-3 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 text-base transition duration-200 select-text"
                style={{
                  backgroundColor: 'var(--color-background)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-border-focus)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(107, 114, 128, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Botón - CORREGIDO */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border text-base font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition duration-200"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-background)',
                borderColor: 'var(--color-primary)'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = 'var(--color-primary-hover)';
                  e.target.style.borderColor = 'var(--color-primary-hover)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = 'var(--color-primary)';
                  e.target.style.borderColor = 'var(--color-primary)';
                }
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 0, 0, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
              }}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg 
                    className="animate-spin -ml-1 mr-3 h-5 w-5" 
                    style={{ color: 'var(--color-background)' }}
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
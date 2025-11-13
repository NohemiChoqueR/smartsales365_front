// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth'; // Asumiendo que `register` está en useAuth

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Asumiendo que el hook useAuth provee la función register
  const { register } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Preparamos los datos a enviar
    const userData = {
      firstName, // Nombre (ajusta si el backend espera otro nombre de campo, ej: 'name')
      email,
      password,
    };

    try {
      // Llamada a la función de registro
      await register(userData);
      
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      // Opcional: Redirigir al login después de un tiempo
      setTimeout(() => {
        window.location.href = '/login'; 
      }, 3000);
      
    } catch (err) {
      // Manejo de errores del backend o de la red
      const errorMessage = err.response?.data?.message || 
                           (err.response?.data && Object.values(err.response.data).flat().join(' ')) ||
                           'Hubo un error al registrar. Por favor, intente nuevamente.';
      setError(errorMessage);
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
        
        {/* Header */}
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
            Cree una cuenta nueva para comenzar
          </h1>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Mensajes de Error y Éxito */}
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
          {success && (
            <div 
              className="px-4 py-3 rounded-lg text-sm text-center"
              style={{ 
                backgroundColor: 'var(--color-success-bg, #d4edda)',
                color: 'var(--color-success, #155724)',
                border: '1px solid var(--color-success, #c3e6cb)'
              }}
            >
              {success}
            </div>
          )}

          <div className="space-y-5">
            {/* Campo Nombre */}
            <div>
              <label 
                htmlFor="firstName" 
                className="block text-sm font-medium text-left mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Nombre
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
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
                placeholder="Su Nombre"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            {/* Campo Email */}
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
                autoComplete="email"
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

            {/* Campo Contraseña */}
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
                autoComplete="new-password"
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

          {/* Botón de Registro */}
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
                  Registrando...
                </div>
              ) : (
                'Registrarse'
              )}
            </button>
          </div>
          
          {/* Enlace al Login */}
          <div className="text-center text-sm">
            <a 
              href="/login" 
              className="font-medium"
              style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
              onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.target.style.textDecoration = 'none'}
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
const API_BASE_URL = '/api/auth';

/**
 * Servicio para encapsular las peticiones HTTP al servidor Spring Boot
 * utilizando el formato x-www-form-urlencoded para que el Backend
 * lo reciba correctamente con @RequestParam
 */
export const authService = {
  
  signup: async (nombre, password, email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ nombre, password, email })
      });
      
      const result = await response.text();
      
      if (!response.ok) {
        throw new Error(result || 'Error al registrar el usuario');
      }
      return result;
    } catch (error) {
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email, password })
      });
      
      const result = await response.text();
      
      if (!response.ok) {
        throw new Error(result || 'Credenciales inválidas');
      }
      return result;
    } catch (error) {
      throw error;
    }
  },

  verify: async (email, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
      const result = await response.text();
      
      if (!response.ok) {
        throw new Error(result || 'Token inválido o expirado');
      }
      return result;
    } catch (error) {
      throw error;
    }
  },

  resend: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email })
      });
      
      const result = await response.text();
      
      if (!response.ok) {
        throw new Error(result || 'Error al reenviar el código');
      }
      return result;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email })
      });
      const result = await response.text();
      if (!response.ok) throw new Error(result || 'Error al solicitar recuperación');
      return result;
    } catch (error) {
      throw error;
    }
  },

  verifyResetCode: async (email, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email, token })
      });
      const result = await response.text();
      if (!response.ok) throw new Error(result || 'Token inválido');
      return result;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (email, token, nuevaContrasena) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email, token, nuevaContrasena })
      });
      const result = await response.text();
      if (!response.ok) throw new Error(result || 'Error al cambiar contraseña');
      return result;
    } catch (error) {
      throw error;
    }
  }
};

export const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Convert seconds to milliseconds
    // Add a 5-second buffer to account for clock skew
    return Date.now() >= (expiry - 5000);
  } catch (error) {
    return true; // Assume expired if token  invalid
  }
};

export const handleLogout = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('jwtUsername');
  window.location.href = '/login';
};
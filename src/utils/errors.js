export function formatApiError(err, defaultMsg = 'Ocurrió un error') {
  if (!err) return defaultMsg;
  
  const payload = err.payload;
  if (!payload) {
    return err.message || defaultMsg;
  }

  // Handle { errors: [...] }
  if (payload.errors && Array.isArray(payload.errors)) {
    const uniqueErrors = [...new Set(payload.errors.map(translateError))];
    return uniqueErrors.join(', ');
  }

  // Handle { error: "..." }
  if (payload.error) {
    return translateError(payload.error);
  }

  // Handle { message: "..." }
  if (payload.message) {
    return translateError(payload.message);
  }

  if (typeof payload === 'string') {
    return translateError(payload);
  }

  return defaultMsg;
}

function translateError(msg) {
  if (typeof msg !== 'string') return JSON.stringify(msg);

  const clean = msg.toLowerCase().trim();

  // Email translations
  if (clean.includes("email can't be blank")) {
    return "El correo electrónico no puede estar vacío";
  }
  if (clean.includes("email is invalid")) {
    return "El correo electrónico no es válido";
  }
  if (clean.includes("email has already been taken") || clean.includes("email ya tomado") || clean.includes("email already exists")) {
    return "El correo electrónico ya está registrado";
  }

  // Password translations
  if (clean.includes("password can't be blank")) {
    return "La contraseña no puede estar vacía";
  }
  if (clean.includes("password is too short")) {
    const match = clean.match(/minimum is (\d+)/);
    if (match && match[1]) {
      return `La contraseña es demasiado corta (mínimo ${match[1]} caracteres)`;
    }
    return "La contraseña es demasiado corta";
  }
  if (clean.includes("password confirmation doesn't match") || clean.includes("password_confirmation doesn't match")) {
    return "La confirmación de la contraseña no coincide";
  }

  // Other general translations
  if (clean.includes("invalid current password") || clean.includes("current password is invalid")) {
    return "La contraseña actual es incorrecta";
  }

  // Fallback to original message (capitalized first letter if possible)
  return msg.charAt(0).toUpperCase() + msg.slice(1);
}

export function jsonResponse(status, message, data = null, error = null, customHeaders = {}) {
  const baseHeaders = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  return new Response(JSON.stringify({
    success: status >= 200 && status < 300,
    message,
    data,
    error,
  }), {
    status,
    headers: baseHeaders,
  });
}

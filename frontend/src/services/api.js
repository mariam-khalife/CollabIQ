const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// Read the saved JWT access token from local or session storage
export const getAccessToken = () => {
  return (
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token")
  );
};

// Save the JWT access token
export const setAccessToken = (token, rememberMe = true) => {
  if (rememberMe) {
    localStorage.setItem("access_token", token);
    sessionStorage.removeItem("access_token");
  } else {
    sessionStorage.setItem("access_token", token);
    localStorage.removeItem("access_token");
  }
};

// Remove the token during logout
export const removeAccessToken = () => {
  localStorage.removeItem("access_token");
  sessionStorage.removeItem("access_token");
};

// Shared function used by all frontend pages to call the backend
export const apiRequest = async (
  endpoint,
  {
    method = "GET",
    body,
    headers = {},
    requiresAuth = true,
  } = {}
) => {
  const token = getAccessToken();

  const requestHeaders = {
    ...headers,
  };

  // Send JSON for normal request bodies
  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders["Content-Type"] = "application/json";
  }

  // Attach the JWT token for protected backend routes
  if (requiresAuth && token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: requestHeaders,
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
          ? body
          : JSON.stringify(body),
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  // Convert backend errors into readable frontend errors
  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      `Request failed with status ${response.status}`;

    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export default API_BASE_URL;
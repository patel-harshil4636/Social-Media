const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// Example function to fetch data from an API
export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

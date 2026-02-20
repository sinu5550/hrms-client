// api.ts
const API_BASE_URL = "http://localhost:5000/api";

export const api = {
  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add Authorization header here later if needed for protected routes
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Try to parse the error message from the backend
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || "An error occurred");
    }

    return response.json();
  },

  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || "An error occurred");
    }
    return response.json();
  },
};

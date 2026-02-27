// api.ts
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://hrms-server-siyan.vercel.app/api";

export const api = {
  async post(
    endpoint: string,
    data: any,
    options: { isFormData?: boolean } = {},
  ) {
    const headers: Record<string, string> = {};
    if (!options.isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: options.isFormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || "An error occurred");
    }

    return response.json();
  },

  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || "An error occurred");
    }
    return response.json();
  },

  async put(
    endpoint: string,
    data: any,
    options: { isFormData?: boolean } = {},
  ) {
    const headers: Record<string, string> = {};
    if (!options.isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: options.isFormData ? data : JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || "An error occurred");
    }
    return response.json();
  },

  async delete(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || "An error occurred");
    }
    return response.json();
  },
};

// api.ts
const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");

const buildUrl = (endpoint: string) => {
  const safeEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${safeEndpoint}`;
};

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

    const response = await fetch(buildUrl(endpoint), {
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
    const response = await fetch(buildUrl(endpoint), {
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

    const response = await fetch(buildUrl(endpoint), {
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
    const response = await fetch(buildUrl(endpoint), {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || "An error occurred");
    }
    return response.json();
  },
};

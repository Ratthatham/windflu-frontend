import { AUTH_KEYS } from "@/constants/auth";
import Cookies from "js-cookie";

const ignoreRoutes = ["/auth/line/login", "/auth/url"];
let refreshFn: Promise<void> | undefined = undefined;

type HttpMethodsType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * Generates a full URL based on the provided baseURL, url, params.
 *
 * @param {string} baseURL - The base URL to build the full URL upon.
 * @param {string} url - The endpoint URL to append to the base URL.
 * @param {Record<string, unknown> | string | undefined} params - The parameters for the URL query string.
 * @param {string | undefined} vip - The VIP token to include in the URL if present.
 * @return {string} The generated full URL with all the parameters included.
 */
export const getFullURL = (
  baseURL: string,
  url: string,
  params: Record<string, unknown> | string | undefined,
) => {
  if (typeof params === "string") {
    return baseURL + url + "?" + params;
  }

  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) => {
          queryParams.append(key, val as string);
        });
        return;
      }

      queryParams.append(key, value as string);
    });
  }

  return queryParams.toString()
    ? baseURL + url + "?" + queryParams.toString()
    : baseURL + url;
};

/**
 * Asynchronous function to make API calls with customizable options.
 *
 * @param {string} url - The URL for the API call endpoint.
 * @param {HttpMethodsType} [method=GET] - The HTTP method for the request.
 * @param {boolean} [retry=false] - Flag indicating if the request is retried.
 * @param {string} [baseURL=VITE_USER_BASE_URL] - The base URL for the API call.
 * @param {Record<string, string>} [header={ 'Content-Type': 'application/json' }] - The headers for the request.
 * @param {Record<string, unknown> | string | undefined} params - The parameters for the request.
 * @param {Record<string, unknown>} body - The body of the request.
 * @return {Promise<any>} A Promise that resolves to the API response data.
 */
const api = async ({
  url = "",
  method = "GET",
  retry = false,
  baseURL = (process.env.NEXT_PUBLIC_API_URL || "") + "/api",
  header = { "Content-Type": "application/json" },
  resolveError = false,
  params,
  body,
}: {
  url: string;
  method?: HttpMethodsType;
  retry?: boolean;
  baseURL?: string;
  header?: Record<string, string>;
  params?: Record<string, unknown> | string;
  resolveError?: boolean;
  body?: Record<string, unknown> | FormData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<any> => {
  const token = Cookies.get(AUTH_KEYS.ACCESS_TOKEN);

  const isFormData = body instanceof FormData;

  const headers = {
    ...(!isFormData && header),
    ...(Boolean(token) && { Authorization: `Bearer ${token}` }),
    "ngrok-skip-browser-warning": "true",
  } as HeadersInit;

  const fullURL = getFullURL(baseURL, url, params);

  const response = await fetch(fullURL, {
    method,
    headers,
    ...(Boolean(body) && {
      body: isFormData ? (body as FormData) : JSON.stringify({ ...body }),
    }),
  });

  if (response.status === 401 && !ignoreRoutes.includes(url) && !retry) {
    try {
      if (!refreshFn) {
        refreshFn = refreshToken();
      }
      await refreshFn;

      return await api({
        url,
        method,
        retry: true,
        baseURL,
        header,
        ...(Boolean(params) && { params }),
        ...(Boolean(body) && { body }),
      });
    } catch {
      Cookies.remove(AUTH_KEYS.ACCESS_TOKEN);
      Cookies.remove(AUTH_KEYS.REFRESH_TOKEN);

      window.location.href = "/login";
    } finally {
      refreshFn = undefined;
    }
  }
  if (!response.ok) {
    if (resolveError) {
      return await response.json();
    }

    throw new Error(response.status.toString());
  }

  const parsedResponse = await response.json();

  return parsedResponse;
};

export const refreshToken = async () => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/v1/auth/refresh",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: Cookies.get(AUTH_KEYS.REFRESH_TOKEN),
      }),
    },
  );

  if (!res.ok) throw new Error("Failed to refresh token");

  const {
    data: { accessToken, refreshToken },
  } = await res.json();

  if (!accessToken || !refreshToken) {
    throw new Error("Invalid token response");
  }

  Cookies.set(AUTH_KEYS.ACCESS_TOKEN, accessToken, {
    expires: 7, // Set cookie to expire in 7 days
    secure: true, // Use secure cookies in production
    sameSite: "Strict", // Prevent CSRF attacks
  });
  Cookies.set(AUTH_KEYS.REFRESH_TOKEN, refreshToken, {
    expires: 7, // Set cookie to expire in 7 days
    secure: true, // Use secure cookies in production
    sameSite: "Strict", // Prevent CSRF attacks
  });
};

export default api;

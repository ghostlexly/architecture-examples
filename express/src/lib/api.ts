type ApiOptions = RequestInit & {
  json?: Record<any, any>;
  params?: Record<string, string>;
};

const api = {
  get: async (url: string, options?: ApiOptions) =>
    await request(url, { ...options, method: "GET" }),
  post: async (url: string, options?: ApiOptions) =>
    await request(url, { ...options, method: "POST" }),
  put: async (url: string, options?: ApiOptions) =>
    await request(url, { ...options, method: "PUT" }),
  delete: async (url: string, options?: ApiOptions) =>
    await request(url, { ...options, method: "DELETE" }),
  patch: async (url: string, options?: ApiOptions) =>
    await request(url, { ...options, method: "PATCH" }),
};

const request = async (url: string, options: ApiOptions) => {
  const reqOpts: RequestInit = { ...options };

  // ----------------------------------------
  // If we have a JSON body, stringify it and set the content type
  // ----------------------------------------
  if (options?.json) {
    reqOpts.body = JSON.stringify(options.json);

    reqOpts.headers = {
      "Content-Type": "application/json",
      ...reqOpts.headers,
    };
  }

  // ----------------------------------------
  // If we have params, add them to the URL
  // ----------------------------------------
  if (options?.params) {
    const params = new URLSearchParams(options.params);

    // Check if there are existing query parameters in the URL
    const separator = url.includes("?") ? "&" : "?";

    url = `${url}${separator}${params.toString()}`;
  }

  // ----------------------------------------
  // Make the request
  // ----------------------------------------
  const response = await fetch(url, options);

  // ----------------------------------------
  // Run the middleware
  // ----------------------------------------
  await middleware(response);

  // ----------------------------------------
  // Parse the response
  // ----------------------------------------
  const data = await response.json();

  return data;
};

const middleware = async (response: Response) => {
  if (response.status === 401) {
    console.log(
      "[GhostLexly-Auth] 401 error detected, logging out automatically..."
    );
    // destroySession();
  }

  if (!response.ok) {
    return Promise.reject(await response.json());
  }
};

export { api };

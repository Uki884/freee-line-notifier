export const publicApi = async (path: string, options: RequestInit) => {
  const response = await fetch(
    `${process.env.FREEE_PUBLIC_API_URL}/public_api/${path}`,
    {
      ...options,
    },
  );

  return response;
};

export const privateApi = async (path: string, options: RequestInit) => {
  const response = await fetch(`${process.env.FREEE_API_URL}/api/1/${path}`, {
    ...options,
    headers: {
      ...options.headers,
    },
  });

  return response;
};

export const freeeApi = {
  public: publicApi,
  private: privateApi,
};

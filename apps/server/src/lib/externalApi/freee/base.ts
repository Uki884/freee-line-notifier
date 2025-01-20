export const publicApi = async (path: string, options: RequestInit) => {
  const response = await fetch(
    `https://accounts.secure.freee.co.jp/public_api/${path}`,
    {
      ...options,
    },
  );

  return response;
};

export const privateApi = async (path: string, options: RequestInit) => {
  const response = await fetch(`https://api.freee.co.jp/api/1/${path}`, {
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

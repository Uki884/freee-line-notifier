type Payload = {
  accessToken: string;
};

type Profile = {
  userId: string;
  displayName: string;
  statusMessage: string;
  pictureUrl: string;
};

export const getProfile = async ({ accessToken }: Payload) => {
  const response = await fetch("https://api.line.me/v2/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return (await response.json()) as Profile;
};


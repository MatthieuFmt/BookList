interface IOptions {
  method: string;
  headers: HeadersInit;
  body?: string;
}

// récupère les infos de token (userID, email, date d'expiration)
export const parseJwt = (token: string) => {
  if (!token || token === "undefined") {
    return null;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

export const fetchApi = async (url: string, method: string, body?: any) => {
  let token = sessionStorage.getItem("accessToken") || "";

  if (parseJwt(token)) {
    const timestampInSeconds = Math.floor(Date.now() / 1000);
    const tokenExpireTimestamp = parseJwt(token).exp;

    // si l'access token a expiré, appelle la fonction qui utilise le refresh token de l'utilisateur pour mettre à jour l'access token
    if (timestampInSeconds >= tokenExpireTimestamp) {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: sessionStorage.getItem("refreshToken"),
          userId: sessionStorage.getItem("userId"),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.erreur) {
            throw new Error(data.erreur);
          }

          sessionStorage.setItem("accessToken", data.accessToken);
          token = data.accessToken;
        })
        .catch((error) => {
          // supprime les tokens et recharge la page si le refresh token a expiré
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshToken");
          sessionStorage.removeItem("userId");

          window.location.reload();

          return error;
        });
    }
  }

  let options: IOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  };
  if (method !== "GET") {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/${url}`,
    options
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.erreur) {
        throw new Error(data.erreur);
      }
      console.log(data);

      return data;
    })
    .catch((error) => {
      return console.error(error);
    });
  return response;
};

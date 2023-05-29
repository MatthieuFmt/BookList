interface IOptions {
  method: string;
  headers: HeadersInit;
  body?: string;
}

// récupère les infos de token (userID, email, date d'expiration)
const parseJwt = (token: string) => {
  if (!token) {
    return null;
  }
  let base64Url = token.split(".")[1];
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  let jsonPayload = decodeURIComponent(
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
  let token = localStorage.getItem("access-token") || "";

  // évite une erreur si le token est vide
  if (token) {
    token = JSON.parse(token);
  }

  if (parseJwt(token)) {
    const timestampInSeconds = Math.floor(Date.now() / 1000);
    const tokenExpireTimestamp = parseJwt(token).exp;

    // si l'access token a expiré, appelle la fonction qui utilise le refresh token de l'utilisateur pour mettre à jour l'access token
    // TODO : modifier l'emplacement du refresh token pour le placer dans les cookies sécurisés (access token aussi)
    // TODO : quand l'access token expire, renvoie le refresh token au back pour mettre à jour l'access token
    if (timestampInSeconds >= tokenExpireTimestamp) {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idUser: parseJwt(token).id }),
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("access-token", JSON.stringify(data.access));
          token = data.access;
        })
        .catch((error) => {
          // TODO : il faut recevoir un code particulier si le refreshToken est lui aussi expiré et faire une redirection vers la page d'accueil
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
      return data;
    })
    .catch((error) => {
      return console.error(error);
    });

  return response;
};

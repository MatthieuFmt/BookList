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
  let token = localStorage.getItem("accessToken") || "";

  // évite une erreur si le token est vide
  // if (token) {
  //   try {
  //     token = JSON.parse(token);
  //   } catch (error) {
  //     console.error("Erreur lors de l'analyse du token JSON :", error);
  //   }
  // }

  if (parseJwt(token)) {
    const timestampInSeconds = Math.floor(Date.now() / 1000);
    const tokenExpireTimestamp = parseJwt(token).exp;

    // si l'access token a expiré, appelle la fonction qui utilise le refresh token de l'utilisateur pour mettre à jour l'access token
    console.log("test");

    if (timestampInSeconds >= tokenExpireTimestamp) {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: localStorage.getItem("refreshToken"),
          userId: localStorage.getItem("userId"),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.erreur) {
            throw new Error(data.erreur);
          }
          console.log(data);
          // ici
          localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
          token = JSON.stringify(data.accessToken);
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

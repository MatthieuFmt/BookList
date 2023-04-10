const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken"); // Récupérer le refresh token du local storage
    if (!refreshToken) {
      return null;
    }

    // Envoyer une requête POST à la route /auth/refresh-token avec le refresh token

    // l'url doit être dans une variable d'environment
    const response = await fetch("http://localhost:3000/auth/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.access;
    localStorage.setItem("accessToken", newAccessToken); // Stocker le nouvel access token dans le local storage

    return newAccessToken;
  } catch (error) {
    console.error("Error during token refresh:", error);
    return null;
  }
};

type RequestHeaders = Record<string, string | undefined>;

// Créez une interface pour les options de requête qui étend RequestInit et inclut les en-têtes sous forme de Record
// export interface RequestOptions {
//   method?: string;
//   headers?: RequestHeaders; // <-- Allow headers to be undefined
//   body?: any;
// }
// export interface RequestOptions extends RequestInit {
//   headers?: HeadersInit;
// }

// fonction à appeler à chaque requete où un authentification est nécessaire
export interface RequestOptions {
  method?: string;
  headers?: Record<string, string | undefined>;
  body?: any;
}

export const fetchWithRefresh = async (
  url: string,
  options: any
): Promise<Response> => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      if (response.status === 401) {
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          const headers = new Headers(options.headers);
          headers.set("Authorization", `Bearer ${newAccessToken}`);
          const newOptions = { ...options, headers };
          return await fetch(url, newOptions);
        } else {
          throw new Error("Refresh token expired");
        }
      }
    }

    return response;
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message === "Refresh token expired") {
      console.log("Refresh token expired, redirecting to login...");
    } else {
      console.log("Error during fetch:", error);
    }

    return new Response(null, { status: 500 });
  }
};

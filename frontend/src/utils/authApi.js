class Auth {
  constructor(config) {
    this.baseUrl = config.baseUrl;
    this.headers = config.headers;
  }

  authorizationUser(userInfo) {
    return fetch(this.baseUrl + "/signin", {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(userInfo),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(
        "Данные заполнены неверно, или такой пользователь не существует"
      );
    });
  }

  authenticationUser(userInfo) {
    return fetch(this.baseUrl + "/signup", {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(userInfo),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(
        "Данные заполнены неверно, или такой пользователь уже существует"
      );
    });
  }

  validateToken(token) {
    return fetch(this.baseUrl + "/users/me", {
      method: "GET",
      headers: { ...this.headers, Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject("JWT не прошел проверку валидации на сервере");
    });
  }
}

const authApi = new Auth({
  baseUrl: "https://auth.nomoreparties.co",
  headers: {
    "Content-Type": "application/json",
  },
});

export default authApi;

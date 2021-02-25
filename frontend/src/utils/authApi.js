class Auth {
  constructor(config) {
    this.baseUrl = config.baseUrl;
    this.headers = config.headers;
  }

  authorizationUser(userInfo) {
    return fetch(this.baseUrl + "/signin", {
      method: "POST",
      headers: this.headers,
      credentials: "include",
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

  validateToken() {
    return fetch(this.baseUrl + "/users/me", {
      method: "GET",
      headers: this.headers,
      withCredentials: true,
      credentials: 'include'
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject("JWT не прошел проверку валидации на сервере");
    })
    .catch((err) => console.log(err));
  }

  logout() {
    return fetch(this.baseUrl + "/logout", {
      method: "GET",
      headers: this.headers,
      withCredentials: true,
      credentials: 'include'
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject("Выйти не получилось! О_о");
    });
  }
}



const authApi = new Auth({
  baseUrl: "https://api.markamadeo.students.nomoreparties.space",
  headers: {
    "Content-Type": "application/json",
  },
});

export default authApi;

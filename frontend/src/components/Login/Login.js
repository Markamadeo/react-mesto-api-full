import { useState } from "react";

function Login(props) {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    props.onLogin(user);
  };

  return (
    <section className={`form form_type_signin form_status_active`}>
      <form
        onSubmit={handleLoginSubmit}
        className="form__container form__container_type_signin"
        name={`${props.name}Form`}
      >
        <h2 className="form__title form__title_type_signin">{props.title}</h2>
        <div className="form__input-container">
          <input
            value={user.email}
            onChange={handleChange}
            name="email"
            type="email"
            className="form__textinput form__textinput_type_signin"
            required
            minLength="2"
            maxLength="40"
            placeholder="Email"
          />
          <span className="form__error" id="signin-error"></span>
        </div>
        <div className="form__input-container">
          <input
            autoComplete="on"
            value={user.password}
            onChange={handleChange}
            name="password"
            type="password"
            className="form__textinput form__textinput_type_signin"
            required
            minLength="2"
            maxLength="200"
            placeholder="Пароль"
          />
          <span className="form__error" id="password-error"></span>
        </div>
        <button
          name={`${props.name}Submit`}
          type="submit"
          className="form__submit-button form__submit-button_type_signin"
        >
          {props.buttonText}
        </button>
      </form>
    </section>
  );
}

export default Login;

import { useState } from "react";
import { Link } from "react-router-dom";

function Register(props) {
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

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    props.onRegister(user);
  };

  return (
    <section className={`form form_type_signin form_status_active`}>
      <form
        onSubmit={handleRegisterSubmit}
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
        <div className="form__text-block">
          <p>Уже зарегистрированы?</p>
          <Link className="form__link" to="/signin">
            Войти
          </Link>
        </div>
      </form>
    </section>
  );
}

export default Register;

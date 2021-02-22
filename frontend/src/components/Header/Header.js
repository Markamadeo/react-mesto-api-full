import { Link, Route } from "react-router-dom";
import logo from "../../images/header__logo.svg";

function Header(props) {
  return (
    <section className="header header_shift_down header_shift_up">
      <img src={logo} alt="Логотип" className="header__logo" />
      <Route path="/signin">
        <Link className="header__link" to="/signup">
          <p>Регистрация</p>
        </Link>
      </Route>
      <Route path="/signup">
        <Link className="header__link" to="/signin">
          <p>Войти</p>
        </Link>
      </Route>
      <Route exact path="/">
        <div className="header__container">
          <p className="header__email">{props.loggedIn.email}</p>
          <a className="header__link" href="/signin" onClick={props.onSignOut}>
            <p>Выйти</p>
          </a>
        </div>
      </Route>
    </section>
  );
}

export default Header;

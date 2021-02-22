import imgOk from "../../images/infotooltips-form-ok.svg";
import imgErr from "../../images/infotooltips-form-error.svg";

function InfoTooltip(props) {
  return (
    <section
      className={`form form_type_foto-viewer ${
        props.isOpen && "form_status_active"
      }`}
    >
      <figure className="form__container form__container_type_info-tooltip">
        <button
          type="button"
          onClick={props.onClose}
          className="form__close-button form__close-button_type_info-tooltip-close-button"
        ></button>
        {props.successfully ? (
          <img
            src={imgOk}
            alt={"Картинка успешной регистрации"}
            className="form__info-tooltip-img"
          />
        ) : (
          <img
            src={imgErr}
            alt={"Картинка ошибки при регитсрации"}
            className="form__info-tooltip-img"
          />
        )}
        {props.successfully ? (
          <figcaption className="form__info-tooltip-description">
            Вы успешно зарегистрировались!
          </figcaption>
        ) : (
          <figcaption className="form__info-tooltip-description">
            Что-то пошло не так! Попробуйте ещё раз.
          </figcaption>
        )}
      </figure>
    </section>
  );
}

export default InfoTooltip;

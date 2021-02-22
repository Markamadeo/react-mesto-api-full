export const BAD_REQUEST_ERR = 400;
export const NOT_FOUND_ERR = 404;
export const INTERNAL_SERVER_ERR = 500;

export const checkResponseToNull = (data) => data === null || Object.keys(data).length === 0;

// eslint-disable-next-line consistent-return
export const errMessage = (status, err) => {
  switch (status) {
    case BAD_REQUEST_ERR:
      return { message: `Переданы некорректные данные в метод создания карточки или пользователя: ${err}` };
    case NOT_FOUND_ERR:
      return { message: 'Карточка или пользователь не найден' };
    case INTERNAL_SERVER_ERR:
      return { message: `Переданы некорректные данные в метод редактирования ссылки на аватар: ${err}` };
    default:
      break;
  }
};

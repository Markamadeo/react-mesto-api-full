import { useState, useEffect } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import ImagePopup from "./ImagePopup/ImagePopup";
import Main from "./Main/Main";
import api from "../utils/api";
import authApi from "../utils/authApi";
import CurrentUserContext from "../contexts/CurrentUserContext";
import EditProfilePopup from "../components/EditProfilePopup/EditProfilePopup";
import EditAvatarPopup from "../components/EditAvatarPopup/EditAvatarPopup";
import AddPlacePopup from "../components/AddPlacePopup/AddPlacePopup";
import Login from "./Login/Login";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import NotFound from "./NotFound/NotFound";
import Register from "./Register/Register";
import InfoTooltip from "./InfoTooltip/InfoTooltip";

function App() {
  const history = useHistory();
  const [cards, setCards] = useState([]);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isPhotoViewerOpen, setIsPhotoViewer] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltip] = useState(false);
  const [isSuccessfully, setSuccessfully] = useState(false);
  const [loggedIn, setLoggedIn] = useState({
    status: false,
  });
  const [selectedCard, setSelectedCard] = useState({
    link: "#",
    name: "",
  });
  const [currentUser, setCurrentUser] = useState({
    name: "",
    about: "",
  });

  useEffect(() => {
    if (loggedIn.status) {
      initialCards();
      getUserInfo();
    }
  }, [loggedIn.status])

  useEffect(() => {
      authApi
        .validateToken()
        .then((data) => {
          const userData = data;
          setLoggedIn({
            status: true,
            ...userData.data,
          });
          history.push('/');
        })
        .catch((err) => console.log(err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initialCards() {
    api
      .initialCards()
      .then((dataCards) => {
        setCards(dataCards.data);
      })
      .catch((err) => console.log(err));
  }

  function getUserInfo() {
    api
      .getUserInfo()
      .then((dataUser) => {
        setCurrentUser(dataUser.data);
      })
      .catch((err) => console.log(err));
  }

  function onLogin(userInfo) {
    authApi
      .authorizationUser(userInfo)
      .then((data) => {
        setLoggedIn({
          status: true,
          email: userInfo.email,
        });
      })
      .catch((err) => {
        setSuccessfully(false);
        setIsInfoTooltip(true);
      });
  }

  function onRegister(userInfo) {
    authApi
      .authenticationUser(userInfo)
      .then((data) => {
        setSuccessfully(true);
        setIsInfoTooltip(true);
        history.push("/signin");
      })
      .catch((err) => {
        console.log(err);
        setSuccessfully(false);
        setIsInfoTooltip(true);
      });
  }

  function onSignOut() {
    authApi
      .logout()
    setLoggedIn({
      ...loggedIn,
      status: false,
    });
    history.push("/signin");
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard.data : c));
        setCards(newCards);
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then((newCard) => {
        const newCards = cards.filter((c) => c._id !== card._id);
        setCards(newCards);
      })
      .catch((err) => console.log(err));
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardPhotoClick(card) {
    setIsPhotoViewer(true);
    setSelectedCard(card);
  }

  function handleUpdateUser(userInfo) {
    api
      .sendProfileInfo(userInfo)
      .then((dataUser) => {
        setCurrentUser(dataUser.data);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(link) {
    api
      .changeAvatar(link)
      .then((dataAvatar) => {
        setCurrentUser(dataAvatar.data);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(data) {
    api
      .sendNewCard(data)
      .then((newCard) => {
        setCards([newCard.data, ...cards]);
      })
      .catch((err) => console.log(err));
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsPhotoViewer(false);
    setIsInfoTooltip(false);
    setSelectedCard({
      link: "#",
      name: "",
    });
  }
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <main className="page">
          <Header loggedIn={loggedIn} onSignOut={onSignOut} />
          <Switch>
            <ProtectedRoute
              path
              exact="/"
              loggedIn={loggedIn.status}
              component={Main}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onClickCard={handleCardPhotoClick}
            />
            {!loggedIn.status ? (
              <Route path="/signin">
                <Login
                  name="login"
                  title="Вход"
                  buttonText="Войти"
                  onLogin={onLogin}
                />
              </Route>
            ) : (
              <Redirect to="/" />
            )}
            {!loggedIn.status ? (
              <Route path="/signup">
                <Register
                  name="register"
                  title="Регистрация"
                  buttonText="Зарегистрироваться"
                  onRegister={onRegister}
                />
              </Route>
            ) : (
              <Redirect to="/" />
            )}
            <Route>
              <NotFound />
            </Route>
          </Switch>
          {loggedIn.status && <Footer />}
        </main>

        <EditProfilePopup
          onUpdateUser={handleUpdateUser}
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
        />

        <EditAvatarPopup
          onUpdateAvatar={handleUpdateAvatar}
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
        />

        <AddPlacePopup
          onAddPlace={handleAddPlaceSubmit}
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
        />

        <ImagePopup
          isOpen={isPhotoViewerOpen}
          onClose={closeAllPopups}
          card={selectedCard}
        ></ImagePopup>

        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          successfully={isSuccessfully}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

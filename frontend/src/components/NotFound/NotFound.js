
function NotFound() {
  const headerStyle = {
    color: 'white',
  };

  return (
  <div className="page__container">
    <h1 style={headerStyle}>404:</h1>
    <h1 style={headerStyle}>Страница не найдена</h1>
  </div>
);
}

export default NotFound;

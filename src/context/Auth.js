import React from 'react';

const AuthContext = React.createContext();

class AuthProvider extends React.Component {

  state = {
    isAuth: JSON.parse(localStorage.getItem('isAuth'))
  };

  constructor() {
    super();
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isAuth !== prevState.isAuth) {
      localStorage.setItem('isAuth', this.state.isAuth);
    }
  }

  login() {
    this.setState({ isAuth: true });
  }

  logout() {
    localStorage.removeItem('graphcoolToken', 'isAuth');
    window.location.reload();
    this.setState({ isAuth: false });
  }

  render() {
    return (
      <AuthContext.Provider
        value={{
          isAuth: this.state.isAuth,
          login: this.login,
          logout: this.logout
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };

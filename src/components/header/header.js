import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { AuthConsumer } from '../../context/Auth';
import LoggedInMenu from './LoggedInMenu';
import LoggedOutMenu from './LoggedOutMenu';

export default function Header() {

  const [isNavVisible, setIsNavVisible] = useState(false);

  const toggleNav = () => {
      setIsNavVisible(!isNavVisible);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Bonaber</Link>
      </div>
      <div className={"header-menu " + (isNavVisible ? "open" : "closed")}>
        <AuthConsumer>
          { ({isAuth, logout}) => (
            isAuth ? (
              <LoggedInMenu logout={logout} toggleNav={toggleNav}/>
            ):(
              <LoggedOutMenu toggleNav={toggleNav}/>
            )
          )}
        </AuthConsumer>
      </div>

      <div
        onClick={toggleNav}
        className={"burger " + (isNavVisible ? "active" : "")}>
        <div></div>
      </div>

    </header>
  );
}

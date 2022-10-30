import UserContext from './context/user/userContext';
import React, { useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const metamaskAuthentication = () => {
    const userContext = useContext(UserContext);
    let navigate = useNavigate();
  
    const { logout} = userContext;

    window.ethereum.on('accountsChanged', function (accounts) {
        logout();
        navigate('/login', {state: {isLoggedOut: true}});
    })
};

export default metamaskAuthentication;
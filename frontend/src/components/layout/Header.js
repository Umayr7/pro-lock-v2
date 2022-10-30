import React, {useEffect, useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom';

import UserContext from '../../context/user/userContext';

const Header = (props) => {
    const userContext = useContext(UserContext);
    
    let navigate = useNavigate();

    const { balance, contract } = props;
    const { loadUser, logout, user } = userContext;

    const onLogout = () => {
        logout().then(() => {
            navigate('/login', {state: {isLoggedOut: true}});
        });        
    }

    useEffect(() => {
        loadUser();
    }, [contract, balance])

  return (
    <>
        <header class="header">
            <div class="header__content">
                <div class="header__logo">
                <Link to="/">
                    <img src="img/logo.png" />
                </Link>
                </div>
                <div class="header__menu">
                <ul class="header__nav"/>
                    <li class="header__nav-item">
                        <Link to="/" class="header__nav-link"  id="dropdownMenuHome"  aria-haspopup="true" aria-expanded="false">
                            Home
                        </Link>
                    </li>
                    <li class="header__nav-item">
                        <Link to="/all-properties" class="header__nav-link" role="button" id="dropdownMenuHome" aria-haspopup="true" aria-expanded="false">
                                Explore Properties
                        </Link>
                    </li>
                </div>
                <div class="header__actions">
                    {
                        user !== null ?
                            
                            <div class="header__action header__action--profile">
                                <a class="header__profile-btn header__profile-btn--verified" href="#" role="button" id="dropdownMenuProfile" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <img src="img/avatars/avatar5.jpg" alt=""/>
                                    <div><p>{user.name}</p>
                                    <span>{parseFloat(balance).toFixed(3)} ETH</span></div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17,9.17a1,1,0,0,0-1.41,0L12,12.71,8.46,9.17a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42l4.24,4.24a1,1,0,0,0,1.42,0L17,10.59A1,1,0,0,0,17,9.17Z"></path></svg>
                                </a>

                                <ul class="dropdown-menu header__profile-menu" aria-labelledby="dropdownMenuProfile">
                                    <li><Link to="/profile"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.71,12.71a6,6,0,1,0-7.42,0,10,10,0,0,0-6.22,8.18,1,1,0,0,0,2,.22,8,8,0,0,1,15.9,0,1,1,0,0,0,1,.89h.11a1,1,0,0,0,.88-1.1A10,10,0,0,0,15.71,12.71ZM12,12a4,4,0,1,1,4-4A4,4,0,0,1,12,12Z"/></svg> <span>Profile</span></Link></li>
                                    <li><Link onClick={() => onLogout()} to="#"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4,12a1,1,0,0,0,1,1h7.59l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l4-4a1,1,0,0,0,.21-.33,1,1,0,0,0,0-.76,1,1,0,0,0-.21-.33l-4-4a1,1,0,1,0-1.42,1.42L12.59,11H5A1,1,0,0,0,4,12ZM17,2H7A3,3,0,0,0,4,5V8A1,1,0,0,0,6,8V5A1,1,0,0,1,7,4H17a1,1,0,0,1,1,1V19a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V16a1,1,0,0,0-2,0v3a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V5A3,3,0,0,0,17,2Z"/></svg> <span>Sign out</span></Link></li>
                                </ul>
                            </div>
                        :
                            <div class="header__action header__action--signin">
                                <Link class="header__action-btn header__action-btn--signin" to="/login">
                                    <span>Login </span>
                                </Link>
                            </div>
                    }
                </div>

                <button class="header__btn" type="button">
                <span></span>
                <span></span>
                <span></span>
                </button>
            </div>
        </header>   
    </>
  )
}

export default Header
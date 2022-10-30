import React, { useEffect, useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { errorNotification, successNotification } from './layout/Notification';
import UserContext from '../context/user/userContext';

const Login = (props) => {
    let location = useLocation();
    const userContext = useContext(UserContext);

    const { contract, address } = props;
    const { login, error, isAuthenticated, user } = userContext;
    const [sign, setSign] = useState(false);

    let navigate = useNavigate();

    useEffect(() => {
        if (error) {
            navigate('/register', {state: {isRegisterNeeded: true}});
        }
        if (isAuthenticated) {
            navigate('/', {state: {isLoggedIn: true}});
        }

        if (location?.state?.isLoggedOut === true && isAuthenticated == false) {
            successNotification('Success', 'Logged Out Successfully');
            window.history.replaceState({}, document.title)
        }
        if (location?.state?.isMetamaskChanged === true && isAuthenticated == false) {
            errorNotification('METAMASK AUTH EROR', 'Please switch back to your MM account OR Login with the new MM account');
            window.history.replaceState({}, document.title)
        }
        if (sign) {
            setSign(false);
            login(contract, address);
        }

        // eslint-desable-next-line
    }, [error, isAuthenticated, user, sign]);

    const [event, setEvent] = useState("");

    const signMessage = async() => {
        let from = address;
        try {
            const msg = "Welcome to PRO-LOCK";
            const sign = await window.ethereum.request({
                method: 'personal_sign',
                params: [msg, from, 'Random text'],
            });
            setSign(true);
        } catch (err) {
            errorNotification('LOGIN CANCELED', 'please sign in order to login');
        }
          
    }
    
    const onLogin = async(e) => {
        e.preventDefault();
        try {
            await signMessage();
            
        } catch (err) {
            console.log(err);
        }

    };

    return (
        <>
            <div class="container">
                <div class="row row--grid">
                    <div class="col-12">
                        <ul class="breadcrumb">
                            <li class="breadcrumb__item"><a href="index.html">Home</a></li>
                            <li class="breadcrumb__item breadcrumb__item--active">Login</li>
                        </ul>
                    </div>
                    <div class="col-12">
                        <div class="sign">
                            <div class="sign__content">
                                <form action="#" class="sign__form">
                                    <div className="sign_group" style={{marginBottom:"50px"}}>
                                        <h1 style={{color:"white", fontSize:"30px", fontFamily:"inherit", fontWeight:"bold"}}>LOGIN</h1>
                                    </div>
                                        {
                                            event.length>0 &&
                                                <div class="alert__div mb-5" role="alert">
                                                    <p style={{color:"white"}}>
                                                        {event}
                                                    </p>
                                                </div>
                                        }
                                    <button class="sign__btn" type="button"  onClick={onLogin}>Login with Metamask</button>
                                    <span class="sign__text">Don't have an account? <Link to="/register">Register now!</Link></span>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login
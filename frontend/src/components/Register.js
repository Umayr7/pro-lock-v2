import React,{ useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { infoNotification } from './layout/Notification';

import UserContext from '../context/user/userContext';

const Register = (props) => {
    const userContext = useContext(UserContext);
	let location = useLocation();

	const { address } = props;
    const { register, error, isAuthenticated } = userContext;

    let navigate = useNavigate();


	const [ user, setUser] = useState({
        name:"",
		email:"",
		phone:""
    });


    const [event, setEvent] = useState("");

	useEffect(() => {
        if(isAuthenticated) {
            navigate('/');
        }
		if (location?.state?.isRegisterNeeded === true && isAuthenticated == false) {
            infoNotification('INFO', 'Please Fill Out Some Credentials before first time Login');
            window.history.replaceState({}, document.title)
        }

        // eslint-desable-next-line
    }, [error, isAuthenticated, props.history]);

    const handleChange = e => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

	const onRegister =  () => {
        const { name,email, phone } = user
        if(name && email && phone)
        {
			register(user, address);
            // registerUser(name, email, phone)
        } else{
			setEvent("Invalid Credentials");

            setTimeout(() => {
                setEvent("");
            }, 3000);
        }
    }
  return (
    <>
        <div class="container">
			<div class="row row--grid">
				<div class="col-12">
					<ul class="breadcrumb">
						<li class="breadcrumb__item"><a href="index.html">Home</a></li>
						<li class="breadcrumb__item breadcrumb__item--active">Register</li>
					</ul>
				</div>
				<div class="col-12">
					<div class="sign">
						<div class="sign__content">
							<form action="#" class="sign__form">
                                    <div className="sign_group" style={{marginBottom:"50px"}}>
                                        <h1 style={{color:"white", fontSize:"30px", fontFamily:"inherit", fontWeight:"bold"}}>Register</h1>
                                    </div>
								<div class="sign__group">
									<input type="text" class="sign__input" name="name" value={user.name} placeholder="Enter Your name" onChange={handleChange} required />
								</div>
								<div class="sign__group">
									<input type="text" class="sign__input" name="email" value={user.email} placeholder="Email" onChange={handleChange} required />
								</div>
								<div class="sign__group">
									<input type="text" class="sign__input" name="phone" value={user.phone} placeholder="Phone No." onChange={handleChange} required />
								</div>

								<div class="sign__group sign__group--checkbox">
									<input id="remember" name="remember" type="checkbox" checked="checked"/>
									<label for="remember">I agree to the <a href="privacy.html">Privacy Policy</a></label>
								</div>
								
								<button class="sign__btn" type="button" onClick={onRegister}>Sign up</button>

								<span class="sign__text">Already have an account? <Link to="/login">Login!</Link></span>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
    </>
  )
}

export default Register
import { ethers } from 'ethers'
import React, { useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { successNotification } from './layout/Notification';
import UserContext from '../context/user/userContext';

const Home = (props) => {
  const userContext = useContext(UserContext);

  const { logout, isAuthenticated } = userContext;

  const { properties, contract, mounted } = props;

  window.ethereum.on('accountsChanged', function (accounts) {
    logout();
    window.location.reload('/login');
  })

  let location = useLocation();

  useEffect(() => {
    if (location?.state?.isLoggedIn === true && isAuthenticated) {
        successNotification('Success', 'Logged In Successfully');
        window.history.replaceState({}, document.title);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      props.getAllProperties(contract);
    }
  }, [mounted]);



  return (
    <>
        <div class="home">
          <div class="container">
            <div class="row">
              <div class="col-12">
                <div class="home__content">
                  <div style={{color:"wheat", height:"300px", width:"100%", border: "1px solid red;"}}>
                    <h1 class="home__title" style={{color:"black", fontWeight:"600", marginBottom:"10px"}}>PRO-LOCK</h1>
                    <div className="card" style={{backgroundColor:"white", opacity:"0.8", width:"40%", height:"110%"}}>
                      <h3 class="home__text" style={{color:"black", fontWeight:"800", marginBottom:"80px"}}>Digitizing your Assets. WELCOME TO THE FUTURE!</h3>
                      <p style={{color:"black", fontWeight:"600"}}>To Enjoy all our premium features get yourself register now.</p>
                      <p style={{color:"black",  fontWeight:"600"}}>To Register your Account <Link to="/register">Click here</Link></p>
                    </div>
                  </div>
                  <div class="home__btns mb-5 ml-5">
                    <Link to="/all-properties" class="home__btn home__btn--clr ">Explore</Link>
                    <Link to="/add-property" class="home__btn">Create</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="container">
          <section class="row row--grid">
            <div class="col-12">
              <div class="main__title">
                <h2><a href="explore.html">Our Services</a></h2>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-lg-4">
                <div class="step">
                  <span class="step__number">01</span>
                  <h3 class="step__title">Register your property</h3>
                  <p class="step__text">
                    We provide a great secured feature for our valued users to register their properties using our platform in a more secured way than the traditional one.
                  </p>
                </div>
              </div>
              <div class="col-12 col-lg-4">
                <div class="step">
                  <span class="step__number">02</span>
                  <h3 class="step__title">Sell your property</h3>
                  <p class="step__text">
                    Our users can use our premium feature which allows them to sell their property that is registerd in our platorm without including any paid third party realtor.
                  </p>
                </div>
              </div>
              <div class="col-12 col-lg-4">
                <div class="step">
                  <span class="step__number">03</span>
                  <h3 class="step__title">Buy property</h3>
                  <p class="step__text">
                    No worries, if you dont have any property to register but want to buy one in a more secured way, you are most welcome to get your future home from this platform. 
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div class="container">
            <section class="row row--grid">
              <div class="col-12">
                <div class="main__title">
                  <h2>Trending Now</h2>
                  <Link to="/all-properties" class="main__link">View all <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.92,11.62a1,1,0,0,0-.21-.33l-5-5a1,1,0,0,0-1.42,1.42L14.59,11H7a1,1,0,0,0,0,2h7.59l-3.3,3.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l5-5a1,1,0,0,0,.21-.33A1,1,0,0,0,17.92,11.62Z"/></svg></Link>
                </div>
              </div>
              {
                properties.map((property, key) => {
                  return (
                          <div class="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex align-self-stretch">
                            <div class="card">
                                <Link to="/property-details" state={{ property: property }} class="card__cover">
                                    <img src={`${property.image}`} alt=""/>
                                </Link>
                                <h3 class="card__title"><a href="item.html"> {property.size.toString()} Sq.Ft</a></h3>
                                    <Link to="/property-details" state={{ property: property }}>
                                      @{property.location}
                                    </Link>
                                    <div class="card__price card__info">
                                        <span>Reserve price</span>
                                        <span>{
                                            parseFloat(ethers.utils.formatEther(property.price)).toFixed(2)
                                        } ETH</span>
                                    </div>
                            </div>
                        </div>
                  )
              })
              }
            </section>
          </div>
          <div style={{height: "200px"}}>

          </div>
        </div>
    </>
  )
}

export default Home
import React from 'react'
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
        <footer class="footer mt-5">
            <div class="container">
                <div class="row">
                    <div class="col-12 col-sm-8 col-md-6 col-lg-6 col-xl-4 order-4 order-md-1 order-lg-4 order-xl-1">
                        <div class="footer__logo">
                            <img src="img/logo.png" style={{width:"200px", height:"200px", marginTop:"-100px"}} alt=""/>
                        </div> 
                        <p class="footer__tagline">PRO-LOCK is an esteemed platform for registering, buying and selling property.</p>

                        <div class="footer__lang">
                            <a class="footer__lang-btn" href="#" role="button" id="dropdownLang" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="img/flags/uk.svg" alt=""/>
                                <span>English</span>
                            </a>
                        </div>
                    </div>

                    <div class="col-6 col-md-4 col-lg-3 col-xl-2 order-1 order-md-2 order-lg-1 order-xl-2 offset-md-2 offset-lg-0 mb-3">
                        <h6 class="footer__title">Pro-Lock</h6>
                        <div class="footer__nav">
                            <Link to="/" class="header__nav-link" role="button" id="dropdownMenuHome" aria-haspopup="true" aria-expanded="false">
                                Home
                            </Link>
                            <Link to="/all-properties" class="header__nav-link" role="button" id="dropdownMenuHome" aria-haspopup="true" aria-expanded="false">
                                Explore Properties
                            </Link>
                        </div>
                    </div>

                    
                    
                </div>

                <div class="row">
                    <div class="col-12">
                        <div class="footer__content">
                            <small class="footer__copyright">© PRO-LOCK, 2022. Created by TEAM PRO-LOCK.</small>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </>
  )
}

export default Footer
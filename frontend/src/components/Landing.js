import React from 'react'

const Landing = ({properties}) => {
  return (
    <>
		<div class="home">
			<div class="container">
				<div class="row">
					<div class="col-12">
						<div class="home__content">
							<h1 class="home__title">The largest NFT marketplace</h1>
							<p class="home__text">Digital marketplace for crypto collectibles and non-fungible tokens. <br/>Buy, sell, and discover exclusive digital assets.</p>

							<div class="home__btns">
								<a href="explore.html" class="home__btn home__btn--clr">Explore</a>
								<a href="signin.html" class="home__btn">Create</a>
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
						<h2>Trending Now</h2>

						<a href="authors.html" class="main__link">View all <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.92,11.62a1,1,0,0,0-.21-.33l-5-5a1,1,0,0,0-1.42,1.42L14.59,11H7a1,1,0,0,0,0,2h7.59l-3.3,3.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l5-5a1,1,0,0,0,.21-.33A1,1,0,0,0,17.92,11.62Z"/></svg></a>
					</div>
				</div>
				<div class="col-12">
                    
					<ul class="sellers-list">
                        {
                            properties.map((property, key) => {
                                return (
                                    <li>
                                        <div class="card" key={key} >
                                            <a href="#" class="card__cover">
                                            <img src={`https://ipfs.io/ipfs/${property.image1}`} alt=""/>
                                            </a>
                                            <h3 class="card__title"><a href="item.html">Nesla Tower</a></h3>
                                            <div class="card__author card__author--verified">
                                            <img src="img/avatars/avatar5.jpg" alt=""/>
                                            <a href="author.html">{property.propertyAddress}</a>
                                            </div>
                                            <div class="card__info">
                                            <div class="card__price">
                                                <span>Current price</span>
                                                <span>{window.web3.utils.fromWei(property.price.toString(),'Ether')} </span>
                                            </div>
                                            
                                            <button class="card__likes" type="button">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.16,5A6.29,6.29,0,0,0,12,4.36a6.27,6.27,0,0,0-8.16,9.48l6.21,6.22a2.78,2.78,0,0,0,3.9,0l6.21-6.22A6.27,6.27,0,0,0,20.16,5Zm-1.41,7.46-6.21,6.21a.76.76,0,0,1-1.08,0L5.25,12.43a4.29,4.29,0,0,1,0-6,4.27,4.27,0,0,1,6,0,1,1,0,0,0,1.42,0,4.27,4.27,0,0,1,6,0A4.29,4.29,0,0,1,18.75,12.43Z"/></svg>
                                                <span>189</span>
                                            </button>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                        }
						
					</ul>
				</div>
			</section>
		</div>
    </>
  )
}

export default Landing
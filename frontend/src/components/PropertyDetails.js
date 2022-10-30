import { ethers } from 'ethers'
import React, { useEffect, useContext, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import UserContext from '../context/user/userContext';
import { errorNotification } from './layout/Notification';
import swal from 'sweetalert';


const PropertyDetails = (props) => {
    const location = useLocation();
    const userContext = useContext(UserContext);
	let navigate = useNavigate();
	const [ requestedProperty, setRequestedProperty ] = useState(false);
	const [ status, setStatus ] = useState('');
    const [amount, setAmount] = useState();
	const [bid, setBid] = useState();

    const property = location?.state?.property;
    const { isAuthenticated, requestProperty, removeAcceptedProperty, user } = userContext;

	useEffect(() => {
		console.log('owners...')
		console.log(user?.metaMaskAccount)
		console.log(property.owner);
		const script1 = document.createElement("script");
        script1.src = "js/main.js";
        script1.async = true;

        document.body.appendChild(script1);

		if(!isAuthenticated) {
            navigate('/login');
        } else {
			isPropertyRequested();
		}

        // eslint-disable-next-line
    }, [requestProperty, isAuthenticated]);

	const isPropertyRequested = async () => {
		const propertyTokenId = property.tokenId;

		for (var i = 0 ; i < user.requests.length ; i++) {
			if (user.requests[i].propertyTokenId === propertyTokenId) {
				setRequestedProperty(true);
				setStatus(user.requests[i].status);
				setBid(user.requests[i].bid);
				break;
			}
		}
	}
	
	const buyProperty = async() =>{
		if(property){
			const amountInEther = ethers.utils.parseEther(bid.toString());
			await removeAcceptedProperty(property);

			const result = await props.contract.buyProperty(property.tokenId, { value: amountInEther });
			const txData = await result.wait();
			console.log('buy property transaction data')
			console.log(txData);

			swal({
				title: "Congratulations!",
				text: "You Just Bought This Property",
				icon: "success",
				buttons: false,
				timer: 3000
			}).then(
				() => {
					window.location.href = "/?success=true";
				}
			);
		}
	}
	
	const requestToBuy = async() =>{
		if(property){
			if (amount !== undefined && amount > 0 && amount !== ethers.utils.formatEther(property.price)) {
				if (amount < ethers.utils.formatEther(property.price)) {
					errorNotification('Error', 'Please Offer More or Equal to the minimum offer');
					window.history.replaceState({}, document.title)
				} else {
					requestProperty(property, props.address, amount);

					swal({
						title: "Success!",
						text: "Your Request to Buy Property has been sent to the Owner Successfully",
						icon: "success",
						buttons: false,
						timer: 3000
					}).then(
						() => {
							window.location.href = "/?success=true";
						}
					);
				}
			} else {
				requestProperty(property, props.address, 0);

				swal({
					title: "Success!",
					text: "Your Request to Buy Property has been sent to the Owner Successfully",
					icon: "success",
					buttons: false,
					timer: 3000
				}).then(
					() => {
						window.location.href = "/?success=true";
					}
				);
			}
		}
	}
  	return (
      <>
		{
			property !== undefined ?
				<main class="main">
					<div class="container">
						<div class="row row--grid">
							<div class="col-12">
								<ul class="breadcrumb">
									<li class="breadcrumb__item"><a href="index.html">Home</a></li>
									<li class="breadcrumb__item"><a href="author.html">Author</a></li>
									<li class="breadcrumb__item breadcrumb__item--active">Item</li>
								</ul>
							</div>
							<div class="col-12">
								<div class="main__title main__title--page">
									<h1>Property Detail</h1>
								</div>
							</div>
						</div>

						<div class="row">
							<div class="col-12 col-xl-8">
								<div class="asset__item">
									<a class="asset__img" href={`${property.image}`}>
										<img src={`${property.image}`} alt="" />
									</a>
								</div>
							</div>
							<div class="col-12 col-xl-4">
								<div class="asset__info">
									<div class="asset__desc">
										<h2>Descriptions</h2>
										<p>
											{property.description}
										</p>
									</div>

									<ul class="asset__authors">
										<li>
											<span>Min. Offer Price</span>
											<div class="asset__author">
												<b>{ parseFloat(ethers.utils.formatEther(property.price)).toFixed(2)} ETH</b>
											</div>
										</li>
										{
											status !== '' &&
												(status === 'approved' || status === 'requested') &&
													<li>
														<span>Offered Price</span>
														<div class="asset__author">
															<b>{ bid } ETH</b>
														</div>
													</li>
										}
										<li>
											<span>Creator</span>
											<div class="asset__author asset__author--verified">
												<img src="img/avatars/avatar5.jpg" alt=""/>
												<a href="author.html">@<b>{`${property.owner.slice(0,10)}`}</b></a>
											</div>
										</li>
									</ul>
									{
										user?.metaMaskAccount !== property.owner &&
										<div class="asset__btns">
											{
												status !== '' ?
													status !== 'approved' ?
														<>
															<button class="asset__btn asset__btn--clr" style={{cursor:'not-allowed', pointerEvents:'all !important'}} type="button" disabled>Requested</button>
														</>
													:
														<>
															<button class="asset__btn asset__btn--clr" type="button" onClick={()=>{buyProperty()}}>Pay Now - {bid} ETH</button>
														</>
												:
													<>
															<div class="sign__group">
																<label class="sign__label" for="size">Your Offered Price (in ETH)</label>
																<input id="size" type="text" name="price" class="sign__input" placeholder="E.g. 50" onChange={e => setAmount(e.target.value)} />
																<label class="sign__label" for="size"><b>NOTE: </b> <span style={{color:"grey"}}>Leave the field empty if you are okay with the owner's offer</span></label>
															</div>
														<button class="asset__btn asset__btn--clr" type="button" onClick={()=>{requestToBuy()}}>Request To Buy</button>
													</>
											}
										</div>
									}
									{/* <div class="asset__btns">
										{
											status !== '' ?
												status !== 'approved' ?
													<button class="asset__btn asset__btn--clr" style={{cursor:'not-allowed', pointerEvents:'all !important'}} type="button" disabled>Requested</button>
												:
													<>
														<button class="asset__btn asset__btn--clr" type="button" onClick={()=>{buyProperty()}}>Pay Now - {bid} ETH</button>
													</>
											:
												<>
														<div class="sign__group">
															<label class="sign__label" for="size">Your Offered Price (in ETH)</label>
															<input id="size" type="text" name="price" class="sign__input" placeholder="E.g. 50" onChange={e => setAmount(e.target.value)} />
															<label class="sign__label" for="size"><b>NOTE: </b> <span style={{color:"grey"}}>Leave the field empty if you are okay with the owner's offer</span></label>
														</div>
													<button class="asset__btn asset__btn--clr" type="button" onClick={()=>{requestToBuy()}}>Request To Buy</button>
												</>
										}
									</div> */}
								</div>
							</div>
						</div>

						<section class="row row--grid">
							<div class="col-12">
								<div class="main__title main__title--border-top">
									<h2><a href="explore.html">Other author assets</a></h2>
								</div>
							</div>
							<div class="col-12">
								<div class="main__carousel-wrap">
									<div class="main__carousel main__carousel--explore owl-carousel" id="explore">
									{
										props.properties.map((property, key) => {
											return (
												<div class="card">
													<Link to="/property-details" state={{ property: property }} class="card__cover">
														<img src={`${property.image}`} alt=""/>
													</Link>
													<h3 class="card__title"><a href="item.html"> {property.size.toString()} Sq.Ft</a></h3>
														<a href="author.html">@{property.location}</a>
														<div class="card__price card__info">
															<span>Reserve price</span>
															<span>{
																parseFloat(ethers.utils.formatEther(property.price)).toFixed(2)
															} ETH</span>
														</div>
												</div>
											)
										})
									}
								</div>
								<button class="main__nav main__nav--prev" data-nav="#explore" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17,11H9.41l3.3-3.29a1,1,0,1,0-1.42-1.42l-5,5a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l5,5a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L9.41,13H17a1,1,0,0,0,0-2Z"/></svg></button>
								<button class="main__nav main__nav--next" data-nav="#explore" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.92,11.62a1,1,0,0,0-.21-.33l-5-5a1,1,0,0,0-1.42,1.42L14.59,11H7a1,1,0,0,0,0,2h7.59l-3.3,3.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l5-5a1,1,0,0,0,.21-.33A1,1,0,0,0,17.92,11.62Z"/></svg></button>
							</div>
						</div>
					</section>
				</div>
			</main>
			: null
		}
      </>
  )
}

export default PropertyDetails
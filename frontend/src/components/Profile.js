import React,{useState, useContext, useEffect} from 'react'
import { ethers } from 'ethers'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Badge, Button } from 'reactstrap';
import { successNotification } from './layout/Notification';

import UserContext from '../context/user/userContext';

const Profile = (props) => {
	let location = useLocation();
    const userContext = useContext(UserContext);
	
	const {contract, address, balance, setMounted} = props;

	const [profileProperties,setProfileProperties] = useState([]);
	const [requestedProperties,setRequestedProperties] = useState([]);
	const [offeredProperties,setOfferedProperties] = useState([]);
	const [state, setState] = useState(false);
	const [propertyUpdate,setPropertyUpdate] = useState(false);
	const [flag,setFlag] = useState(true);

    const { user, isAuthenticated, offers, cancelProperty, rejectProperty, acceptProperty } = userContext;

    let navigate = useNavigate();
	useEffect(() => {
		if (propertyUpdate) {
			setPropertyUpdate(false);
			loadPurchasedProperties(contract);
			loadRequestedProperties(contract);
			loadOfferedProperties(contract);
		}
	}, [offers])
	
	useEffect(() => {
		if (flag) {
			setFlag(false);
			
			if(!isAuthenticated) {
				navigate('/login');
			}
			if (contract) {
				loadPurchasedProperties(contract);
				loadRequestedProperties(contract);
				loadOfferedProperties(contract);
			}
			if (location?.state?.isCreated === true) {
				successNotification('Success', 'Property Registed Successfully');
				window.history.replaceState({}, document.title)
			}
			if (location?.state?.isBought === true) {
				successNotification('Success', 'Property Purchased Successfully');
				window.history.replaceState({}, document.title)
			}
			const script1 = document.createElement("script");
			script1.src = "js/main.js";
			script1.async = true;
	
			document.body.appendChild(script1);
		}
        // eslint-disable-next-line
    }, [isAuthenticated, state, flag ,user ]);

	const listAndUnlistProperty = async(property) => {
		if (property.isAvailable) {
			const result = await contract.unListProperty(property.tokenId);
			const txData = await result.wait();
			console.log('unlist transaction data')
			console.log(txData);
			successNotification('Success', 'Property Unlisted Successfully');
		} else {
			const result = await contract.listProperty(property.tokenId);
			const txData = await result.wait();
			console.log('list transaction data')
			console.log(txData);
			successNotification('Success', 'Property Listed Successfully');
		}
		setMounted(true);
		loadPurchasedProperties(contract);
		loadRequestedProperties(contract);
		loadOfferedProperties(contract);
	}
	const loadPurchasedProperties = async (ctr) => {
		setProfileProperties([]);
        const propertyCount =  await ctr.propertyCount();
        for (let i = 1; i <= propertyCount; i++) {
            const property = await ctr.properties(i)
            const owner = await ctr.ownerOf(i)
            if ( owner===address) {
                // get uri url from property contract
                const uri = await ctr.tokenURI(property.tokenId)       
                // use uri to fetch the property metadata stored on ipfs 
                const response = await fetch(uri);
                const metaData = await response.json();
                // Add item to items array
				let propertyData = {
					location: metaData.location,
					image: metaData.image,
					size: metaData.size,
					price: property.price.toString(),
					owner: property.owner,
					isAvailable: property.isAvailable,
					tokenId: i
				};
				setProfileProperties(properties => [...properties, propertyData]);
            }
        }
    }

	const loadRequestedProperties = async (ctr) => {
		setRequestedProperties([]);
        const propertyCount =  await ctr.propertyCount();
        for (let i = 1; i <= propertyCount; i++) {
            const property = await ctr.properties(i)
            const owner = await ctr.ownerOf(i)
			// get uri url from property contract
			const uri = await ctr.tokenURI(property.tokenId)       
			// use uri to fetch the property metadata stored on ipfs 
			const response = await fetch(uri);
			const metaData = await response.json();
			for (var j = 0 ; j < user.requests.length ; j++) {
				const userRequestedTokenId = user.requests[j].propertyTokenId.toString();
				const propertyTokenId = property.tokenId.toString();
				if (propertyTokenId === userRequestedTokenId) {
					// Add item to items array
					let propertyData = {
						location: metaData.location,
						image: metaData.image,
						size: metaData.size,
						price: property.price.toString(),
						owner: property.owner,
						isAvailable: property.isAvailable,
						tokenId: user.requests[j].propertyTokenId,
						bid: user.requests[j].bid,
						status: user.requests[j].status
					};
					setRequestedProperties(requestedProperties => [...requestedProperties, propertyData]);
				}
			}
        }
	}

	const loadOfferedProperties = async (ctr) => {
		setOfferedProperties([]);
        const propertyCount =  await ctr.propertyCount();
        for (let i = 1; i <= propertyCount; i++) {
            const property = await ctr.properties(i)
            const owner = await ctr.ownerOf(i)
			// get uri url from property contract
			const uri = await ctr.tokenURI(property.tokenId)       
			// use uri to fetch the property metadata stored on ipfs 
			const response = await fetch(uri);
			const metaData = await response.json();
			var offerMetaDataList = [];
			var propertyData = {};
			for (var j = 0 ; j < offers.length ; j++) {
				if (offers[j].tokenId.toString() === property.tokenId.toString()) {
					var offeredProperty = offers[j].offers;
					for (var k = 0 ; k < offeredProperty.length ; k++) {
						var requesterData = offeredProperty[k];
						let offerMetaDataObject = {
							requesterId: requesterData.requesterId,
							created_at: requesterData.created_at,
							bid: requesterData.bid,
							status: requesterData.status
						};
						offerMetaDataList.push(offerMetaDataObject);
					}
					// Add item to items array
					propertyData = {
						location: metaData.location,
						image: metaData.image,
						size: metaData.size,
						price: property.price.toString(),
						owner: property.owner,
						isAvailable: property.isAvailable,
						tokenId: property.tokenId,
						offers: offerMetaDataList
					};
					break;
				}
			}
			if (Object.keys(propertyData).length > 0) {
				setOfferedProperties(offeredProperties => [...offeredProperties, propertyData]);
			}
        }
	}

	const cancelRequest = async (property) => {
		var requestList = user.requests;
		var requesterData={};
		for (var i = 0 ; i < requestList.length ; i++) {
			if (property.tokenId.toString() === requestList[i].propertyTokenId.toString()) {
				requesterData.userId = user._id;
				requesterData.ownerId = requestList[i].ownerId;
				requesterData.propertyTokenId = property.tokenId;
				break;
			}
		}
		setPropertyUpdate(true);
		cancelProperty(requesterData);
		successNotification('Success', 'Property Request Cancelled Successfully');
	}

	const rejectOffer = async (property, requesterMMId) => {
		var offeredData={};
		for (var i = 0 ; i < offers.length ; i++) {
			if (property.tokenId.toString() === offers[i].tokenId.toString()) {
				offeredData.userMetaMaskId = user.metaMaskAccount;
				offeredData.propertyTokenId = offers[i].tokenId;

				var propertyOffers = offers[i].offers;
				for (var j = 0 ; j < propertyOffers.length ; j++) {
					if (requesterMMId === propertyOffers[j].requesterId) {
						offeredData.requesterMetaMaskId = requesterMMId;
						break;
					}
				}
				break;
			}
		}
		setOfferedProperties([]);
		setPropertyUpdate(true);
		rejectProperty(offeredData);
		successNotification('Success', 'Offer Rejected Successfully');
	}

	const approveOffer = async (property, requesterMMId) => {
		var offeredData={};
		for (var i = 0 ; i < offers.length ; i++) {
			if (property.tokenId.toString() === offers[i].tokenId.toString()) {
				offeredData.userMetaMaskId = user.metaMaskAccount;
				offeredData.propertyTokenId = offers[i].tokenId;

				var propertyOffers = offers[i].offers;
				for (var j = 0 ; j < propertyOffers.length ; j++) {
					if (requesterMMId === propertyOffers[j].requesterId) {
						offeredData.requesterMetaMaskId = requesterMMId;
						break;
					}
				}
				break;
			}
		}
		setOfferedProperties([]);
		setPropertyUpdate(true);
		acceptProperty(offeredData);
		successNotification('Success', 'Offer Accepted Successfully');
	}

	return (
		<>
		<div class="main__author" data-bg="img/homeBann.jpeg">
            <div className="d-flex justify-content-center" >
                <h1 style={{marginTop:"10%", fontWeight:"600"}}>
                        <div style={{backgroundColor:"black", opacity:"0.8", width:"100%", height:"100%"}}>
                            MY PROFILE
                        </div>
                </h1>
            </div>
        </div>
	  	<div class="container">
			<div class="row row--grid">
				<div class="col-12 col-xl-3">
					<div class="author author--page">
						<div class="author__meta">
							<a href="author.html" class="author__avatar author__avatar--verified">
								<img src="img/avatars/avatar5.jpg" alt=""/>
							</a>
							<h1 class="author__name"><a href="author.html">{ user && user.name  }</a></h1>
							<h2 class="author__nickname"><a href="author.html">{ parseFloat(balance).toFixed(3) } ETH</a></h2>
							<p>Account No. <b>{ user && user.metaMaskAccount.slice(0,5)  }.....{user && user.metaMaskAccount.slice(-5)}</b></p>
							<div class="author__code">
								<input type="text" value={ user && user.phone } id="author-code"/>
								<button type="button">
									<span>Phone No. Copied</span>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18,19H6a3,3,0,0,1-3-3V8A1,1,0,0,0,1,8v8a5,5,0,0,0,5,5H18a1,1,0,0,0,0-2Zm5-9.06a1.31,1.31,0,0,0-.06-.27l0-.09a1.07,1.07,0,0,0-.19-.28h0l-6-6h0a1.07,1.07,0,0,0-.28-.19l-.09,0L16.06,3H8A3,3,0,0,0,5,6v8a3,3,0,0,0,3,3H20a3,3,0,0,0,3-3V10S23,10,23,9.94ZM17,6.41,19.59,9H18a1,1,0,0,1-1-1ZM21,14a1,1,0,0,1-1,1H8a1,1,0,0,1-1-1V6A1,1,0,0,1,8,5h7V8a3,3,0,0,0,3,3h3Z"/></svg>
								</button>
							</div>
							<a href="#" class="author__link" style={{pointerEvents: 'none'}}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
									<path d="M21.41,8.64s0,0,0-.05a10,10,0,0,0-18.78,0s0,0,0,.05a9.86,9.86,0,0,0,0,6.72s0,0,0,.05a10,10,0,0,0,18.78,0s0,0,0-.05a9.86,9.86,0,0,0,0-6.72ZM4.26,14a7.82,7.82,0,0,1,0-4H6.12a16.73,16.73,0,0,0,0,4Zm.82,2h1.4a12.15,12.15,0,0,0,1,2.57A8,8,0,0,1,5.08,16Zm1.4-8H5.08A8,8,0,0,1,7.45,5.43,12.15,12.15,0,0,0,6.48,8ZM11,19.7A6.34,6.34,0,0,1,8.57,16H11ZM11,14H8.14a14.36,14.36,0,0,1,0-4H11Zm0-6H8.57A6.34,6.34,0,0,1,11,4.3Zm7.92,0h-1.4a12.15,12.15,0,0,0-1-2.57A8,8,0,0,1,18.92,8ZM13,4.3A6.34,6.34,0,0,1,15.43,8H13Zm0,15.4V16h2.43A6.34,6.34,0,0,1,13,19.7ZM15.86,14H13V10h2.86a14.36,14.36,0,0,1,0,4Zm.69,4.57a12.15,12.15,0,0,0,1-2.57h1.4A8,8,0,0,1,16.55,18.57ZM19.74,14H17.88A16.16,16.16,0,0,0,18,12a16.28,16.28,0,0,0-.12-2h1.86a7.82,7.82,0,0,1,0,4Z"/>
								</svg> 
								{ user && user.email }
							</a>
						</div>



					</div>
				</div>

				<div class="col-12 col-xl-9">
					<div class="profile">
						<ul class="nav nav-tabs profile__tabs" id="profile__tabs" role="tablist">
							<li class="nav-item">
								<a class="nav-link active" data-toggle="tab" href="#tab-1" role="tab" aria-controls="tab-1" aria-selected="true">All Properties</a>
							</li>

							<li class="nav-item">
								<a class="nav-link" data-toggle="tab" href="#tab-2" role="tab" aria-controls="tab-2" aria-selected="false">Offers</a>
							</li>

							<li class="nav-item">
								<a class="nav-link" data-toggle="tab" href="#tab-3" role="tab" aria-controls="tab-3" aria-selected="false">Request for buy</a>
							</li>
						</ul>
					</div>
					<div class="tab-content">
						<div class="tab-pane fade show active" id="tab-1" role="tabpanel">
							<div class="row row--grid">
							{
								profileProperties.length > 0 ?
                                    profileProperties.map((property) => {
                                        return (
                                            <div class="col-12 col-sm-6 col-lg-4">
                                            <div class="card">
												<Link to="/property-details" state={{ property: property }} class="card__cover">
													<img src={`${property.image}`} alt=""/>
												</Link>
                                                <div class="card-body">
													<h3 class="card__title"><a href="item.html"> {property.size.toString()} Sq.Ft</a></h3>
                                                    <a href="author.html">@{property.location}</a>
                                                    <div class="card__price card__info">
                                                        <span>Reserve price</span>
                                                        <span>{
                                                            parseFloat(ethers.utils.formatEther(property.price)).toFixed(2)
                                                        } ETH</span>
                                                    </div>
													<div class="asset__btns">
														<label className="custom-toggle custom-toggle-primary">
															<input type="checkbox" checked=""/>
															<span className="custom-toggle-slider rounded-circle" data-label-off="OFF" data-label-on="ON"></span>
														</label>
													</div>
													<div>
														{
															property.isAvailable ?
																<Badge color="success">Listed</Badge> :
																<Badge color="danger">Not Listed</Badge>
														}
													</div>
													<div>
														<Button onClick={() => listAndUnlistProperty(property)} className="mt-3">
															{property.isAvailable?"Unlist Property":"List Property"}
														</Button>
													</div>
												</div>
                                            </div>
                                        </div>
                                        )
                                    })  :
									<div className="mt-5 ml-3">
										<span>You don't have any Property!</span>
									</div>
                                }
							</div>
						</div>

						<div class="tab-pane fade" id="tab-2" role="tabpanel">

						<div class="row row--grid">
							{
								offeredProperties.length > 0 ?
                                    offeredProperties.map((property) => {
                                        return (
                                            <div class="col-12 col-sm-6 col-lg-4">
                                            <div class="card">
												<Link to="/property-details" state={{ property: property }} class="card__cover">
													<img src={`${property.image}`} alt=""/>
												</Link>
                                                <div class="card-body">
                                                    <div class="card__price card__info">
                                                        <span>Reserve price</span>
                                                        <span>{
                                                            parseFloat(ethers.utils.formatEther(property.price)).toFixed(2)
                                                        } ETH</span>
                                                    </div>
													<div class="card__price card__info">
														<span>OFFERS</span>
														{
															property.offers.map((offer) => {
																return (
																	<>
																		<div class="card__price card__info">
																			<p>
																				RequesterId: <b>{offer.requesterId.slice(0,4)}...{offer.requesterId.slice(-4)}</b>
																			</p>
																			<p>
																				Requester Bid: <b>{offer.bid} ETH</b>
																			</p>
																			<p >
																				Request Date: <b>{offer.created_at.slice(0,10)}</b>
																			</p>
																		</div>
																		<div>
																			{
																				offer.status === "approved" ?
																					<Button color="success" size="sm" className="mt-3" style={{cursor:'not-allowed', pointerEvents:'all !important'}} disabled>Approved</Button>
																				:
																					<>
																						<Button color="success" size="sm" onClick={() => approveOffer(property, offer.requesterId)} className="mt-3">
																							Approve Offer
																						</Button>
																						<Button color="danger" size="sm" onClick={() => rejectOffer(property, offer.requesterId)} className="ml-2 mt-3">
																							Reject Offer
																						</Button>
																					</>
																			}
																		</div>
																	</>
																)
															})
														}
													</div>
												</div>
                                            </div>
                                        </div>
                                        )
                                    })  :
									<div className="mt-5 ml-3">
										<span>You don't have any Offers!</span>
									</div>
                                }
							</div>
						</div>

						<div class="tab-pane fade" id="tab-3" role="tabpanel">
							<div class="row row--grid">
							{
								requestedProperties.length > 0 ?
                                    requestedProperties.map((property) => {
                                        return (
                                            <div class="col-12 col-sm-6 col-lg-4">
                                            <div class="card">
												<Link to="/property-details" state={{ property: property }} class="card__cover">
													<img src={`${property.image}`} alt=""/>
												</Link>
                                                <div class="card-body">
													<h3 class="card__title"><a href="item.html"> {property.size.toString()} Sq.Ft</a></h3>
                                                    <a href="author.html">@{property.location}</a>
                                                    <div class="card__price card__info">
                                                        <span>Reserve price</span>
                                                        <span>{
                                                            parseFloat(ethers.utils.formatEther(property.price)).toFixed(2)
                                                        } ETH</span>
                                                    </div>
                                                    <div class="card__price card__info">
                                                        <span>Offered price</span>
                                                        <span>{
                                                            parseFloat(property.bid).toFixed(2)
                                                        } ETH</span>
                                                    </div>
													<div class="asset__btns">
														<label className="custom-toggle custom-toggle-primary">
															<input type="checkbox" checked=""/>
															<span className="custom-toggle-slider rounded-circle" data-label-off="OFF" data-label-on="ON"></span>
														</label>
													</div>
													<div>
														{
															property.status &&
																<Badge color="success">{property.status.toUpperCase()}</Badge>
														}
													</div>
													<div>
														{
															property.status === "approved" ?
															<Button className="mt-3">
																<Link to="/property-details" state={{ property: property }}>
																	<span style={{color: "white"}}>Buy Property </span>
																</Link>
															</Button>
															:
																<Button onClick={() => cancelRequest(property)} className="mt-3">
																	Cancel Request
																</Button>
														}
													</div>
												</div>
                                            </div>
                                        </div>
                                        )
                                    }) :
									<div className="mt-5 ml-3">
										<span>You don't have any buy requests!</span>
									</div>
                                }
							</div>
						</div>
					</div>
				</div>
			</div>	
		</div>
	  </>
  )
}

export default Profile
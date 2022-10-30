import React,{ useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';

import { create as ipfsHttpClient } from "ipfs-http-client";
import { ethers } from 'ethers';
import { errorNotification } from './layout/Notification';
import swal from 'sweetalert';

import { requestAccount } from '../functions/requestAccount';

import UserContext from '../context/user/userContext';

const ipfs = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
// const ipfs = create({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

const AddProperty = (props) => {
    const userContext = useContext(UserContext);
	
    const { isAuthenticated } = userContext;

	const { setMounted, contract, user } = props;
    const [location, setLocation] = useState();
    const [size, setSize] = useState();
    const [amount, setAmount] = useState();
    const [image, setImage] = useState();
	const [description, setDescription] = useState();

	let navigate = useNavigate();

	useEffect(() => {
        const script1 = document.createElement("script");
        script1.src = "js/main.js";
        script1.async = true;

        document.body.appendChild(script1);

		if(!isAuthenticated) {
            navigate('/login');
        }

        // eslint-disable-next-line
    }, [user]);

	async function addProperty() {
        if (typeof window.ethereum !== 'undefined') {
            // request access to the user's MetaMask account
            await requestAccount();

            if(image && location && size && description && amount) {
				try {
					const ipfsToken = await ipfs.add(JSON.stringify({location, size, image, description}))
					console.log('ipfs token');
					console.log(ipfsToken)
					listProperty(ipfsToken)
				} catch(error) {
					console.log("ipfs uri upload error: ", error)
				}
            } else {
				errorNotification('Missing Fields', 'Please Fill All Fields');
				window.history.replaceState({}, document.title)
            }
        }
    }
	async function listProperty(ipfsToken) {
		const ipfsURI = `https://ipfs.infura.io/ipfs/${ipfsToken.path}`;
		const amountInEther = ethers.utils.parseEther(amount.toString());
		const result = await contract.addProperty(ipfsURI, amountInEther);
		const txData = await result.wait();
		console.log('create property transaction data')
		console.log(txData);
		setMounted(true);
		swal({
			title: "Success!",
			text: "Success, Your Property is Registered!",
			icon: "success",
			buttons: false,
			timer: 3000
		}).then(
			() => {
				navigate("/profile", {state: {isCreated: true}});
			}
		);
    }
	const imageUpload = async (e) => {
        e.preventDefault();
        const imageBuffer = e.target.files[0];
        
        if (imageBuffer) {
            try {
                const ipfsToken = await ipfs.add(imageBuffer);
				console.log(ipfsToken)
                setImage(`https://ipfs.infura.io/ipfs/${ipfsToken.path}`);
            } catch (err) {
                console.log("Error uploading your image to IPFS. Try Uploading Again.", err);
            }
        }
    }

  return (
    <>
		<div class="main__author" data-bg="img/homeBann.jpeg">
				<div className="d-flex justify-content-center" >
					<h1 style={{marginTop:"10%", fontWeight:"600"}}>
							<div style={{backgroundColor:"black", opacity:"0.8", width:"100%", height:"100%"}}>
								CREATE PROPERTY
							</div>
					</h1>
				</div>
		</div>
		<div class="container">
			<div class="row row--grid d-flex justify-content-center">
				<div class="col-12 col-xl-9">
					<div class="main__title main__title--create">
						<h2>Create Property</h2>
					</div>
					<form action="#" class="sign__form sign__form--create">
						<div class="row">
                            <div class="col-12">
                                <div class="sign__group">
                                    <label class="sign__label" for="itemname">Property address</label>
                                    <input id="itemname" type="text" name="location" class="sign__input" placeholder="e. g. 'A-007 block-9 F.B Area Karachi, Pakistan.'" onChange={e => setLocation(e.target.value)}/>
                                </div>
                            </div>

                            <div class="col-12 col-md-4">
								<div class="sign__group">
									<label class="sign__label" for="size">Property Price (in ETH)</label>
									<input id="size" type="text" name="price" class="sign__input" placeholder="e. g. 50" onChange={e => setAmount(e.target.value)}/>
								</div>
							</div>
                            <div class="col-12 col-md-4 ">
								<div class="sign__group">
									<label class="sign__label" for="size">Property Size (in sq.ft)</label>
									<input id="size" type="text" name="size" class="sign__input" placeholder="e. g. 500" onChange={e => setSize(e.target.value)}/>
								</div>
							</div>
							
							<div class="col-12">
								<h4 class="sign__title">Property Details</h4>
							</div>

							<div class="col-12 col-md-4 ">
								<div class="sign__group">
									<textarea id="desc" name="description" class="sign__input" placeholder="your property details" onChange={e => setDescription(e.target.value)}/>
								</div>
							</div>
							<div class="col-12">
								<h4 class="sign__title">Upload file</h4>
							</div>

							<div class="col-12">
								<div class="sign__file">
									<label id="file1" for="sign__file-upload">e. g. Image, Audio, Video</label>
									<input data-name="#file1" id="sign__file-upload" name="image" class="sign__file-upload" type="file" onChange={imageUpload} accept="video/mp4,video/x-m4v,video/*,.png,.jpg,.jpeg" multiple/>
								</div>
							</div>

							<div class="col-12 col-xl-3">
								<button type="button" class="sign__btn" onClick={addProperty}>Create item</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
    </>
  )
}

export default AddProperty
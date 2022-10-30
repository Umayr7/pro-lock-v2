import React, { useEffect } from 'react'
import { ethers } from 'ethers'
import { Link} from 'react-router-dom';

const Properties = (props) => {
    const { properties, contract, mounted } = props;

    useEffect(() => {
        const script1 = document.createElement("script");
        script1.src = "js/main.js";
        script1.async = true;

        document.body.appendChild(script1);
        if (mounted) {
            props.getAllProperties(contract);
        }

        // eslint-disable-next-line
    }, [mounted]);

    return (
        <>
            <div class="container">
                <div class="row row--grid">
                    <div class="col-12">
                        <ul class="breadcrumb">
                            <li class="breadcrumb__item"><a href="index.html">Home</a></li>
                            <li class="breadcrumb__item breadcrumb__item--active">Explore</li>
                        </ul>
                    </div>
                    <div class="col-12">
                        <div class="main__title main__title--page">
                            <h1>Explore exclusive digital assets</h1>
                        </div>
                    </div>
                    <div class="col-12">
                        <ul class="nav nav-tabs main__tabs" id="main__tabs" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link active" data-toggle="tab" href="#tab-1" role="tab" aria-controls="tab-1" aria-selected="true">All</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="tab-1" role="tabpanel">
                        <div class="row row--grid">
                        {
                            properties.length > 0 ?
                                properties.map((property) => {
                                    return (
                                        <div class="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex align-self-stretch">
                                            <div class="card">
                                                <Link to="/property-details" state={{ property: property }} class="card__cover">
                                                    <img src={property.image} alt=""/>
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
                            :
                                <div class="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex align-self-stretch">
                                    <div class="card">
                                        <h3 class="card__title">No Property available...</h3>
                                    </div>
                                </div>
                        }
                            </div>
                        </div>
                    </div>
            </div>
        </>
    )
}

export default Properties
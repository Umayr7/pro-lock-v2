import React, { useReducer } from 'react'
import axios from 'axios';
import { ethers } from 'ethers';

import UserContext from './userContext';
import UserReducer from './userReducer';

import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_ERRORS,
    REQUEST_SUCCESS,
    REQUEST_FAIL,
    OFFER_SUCCESS,
    OFFER_FAIL,
    CANCEL_FAIL,
    REJECT_FAIL,
    ACCEPT_FAIL,
} from '../types';
import setAuthToken from '../../utils/setAuthToken';

export const UserState = (props) => {
    const initialState = {
        token: localStorage.getItem('token'),
        isAuthenticated: false,
        loading: true,
        user: null,
        offers: null,
        error: null
    };

    const [state, dispatch] = useReducer(UserReducer, initialState);

    // Load User
    const loadUser = async () => {
        setAuthToken(localStorage.token);

        const res = await axios.get('/users/auth');

        try {
            dispatch({
                type: USER_LOADED,
                payload: res.data
            });
            
            offeredProperties();
        } catch (err) {
            dispatch({
                type: AUTH_ERROR
            });
        }
    };

    // Register User
    const register = async (userData, address) => {
        userData.metaMaskAccount = address;

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.post('/users/register', userData, config);

            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            });

            loadUser();
        } catch (err) {
            dispatch({
                type: REGISTER_FAIL,
                payload: err.response.data.msg
            });
        }
    }

    // Login User
    const login = async (contract, metaMaskAccount) => {
        const userData = {
            metaMaskAccount
        }
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.post('/users/login', userData, config);

            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });

            loadUser();
        } catch (err) {
            dispatch({
                type: LOGIN_FAIL,
                payload: err.response.data.msg
            });
        }
    };

    // Request Property
    const requestProperty = async (property, address, amount) => {
        if (amount > 0) {
            var userData = {
                propertyTokenId: property.tokenId,
                ownerId: property.owner,
                requesterId: address,
                bid: amount
            }
        } else {
            var userData = {
                propertyTokenId: property.tokenId,
                ownerId: property.owner,
                requesterId: address,
                bid: ethers.utils.formatEther(property.price)
            }
        }

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.put('/users/request-property', userData, config);

            dispatch({
                type: REQUEST_SUCCESS,
                payload: res.data
            });
            loadUser();
        } catch (err) {
            dispatch({
                type: REQUEST_FAIL,
                payload: err.response.data.msg
            });
        }
    }

    // Offered Properties
    const offeredProperties = async () => {
        try {
            const res = await axios.get(`/users/offered-properties`);
            
            dispatch({
                type: OFFER_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                 type: OFFER_FAIL,
                 payload: err.response.data.msg
            });
        }
    }

    // Cancel Request
    const cancelProperty = async (requestData) => {
        const userData = requestData;
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.put('/users/cancel-property', userData, config);
            
            loadUser();
        } catch (err) {
            dispatch({
                type: CANCEL_FAIL,
                payload: err.response.data.msg
            });
        }
    }

    // Reject Offer
    const rejectProperty = async (offeredProperty) => {
        const userData = offeredProperty;
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.put('/users/reject-property', userData, config);
            
            loadUser();
        } catch (err) {
            dispatch({
                type: REJECT_FAIL,
                payload: err.response.data.msg
            });
        }
    }

    // Reject Offer
    const acceptProperty = async (offeredProperty) => {
        const userData = offeredProperty;
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.put('/users/accept-property', userData, config);
            
            loadUser();
        } catch (err) {
            dispatch({
                type: ACCEPT_FAIL,
                payload: err.response.data.msg
            });
        }
    }

    // Remove Accepted Property's Offer and Requests
    const removeAcceptedProperty = async (offeredProperty) => {
        const userData = {
            ownerMetamaskId: offeredProperty.owner,
            tokenId: offeredProperty.tokenId
        };
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.put('/users/remove-accepted-offers', userData, config);
        } catch (err) {
            dispatch({
                type: ACCEPT_FAIL,
                payload: err.response.data.msg
            });
        }
    }

    // Logout User
    const logout = () => {
        dispatch({type: LOGOUT})
    };

    // Clear Errors
    const clearErrors = () => dispatch({type: CLEAR_ERRORS});

    return (
        <UserContext.Provider value={{
            token: state.token,
            user: state.user,
            offers: state.offers,
            isAuthenticated: state.isAuthenticated,
            loading: state.loading,
            error: state.error,
            register,
            loadUser,
            login,
            requestProperty,
            cancelProperty,
            rejectProperty,
            acceptProperty,
            removeAcceptedProperty,
            logout,
            clearErrors
        }}>
            { props.children }
        </UserContext.Provider>
    )
};
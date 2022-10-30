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
    CANCEL_SUCCESS,
    REJECT_SUCCESS,
    REJECT_FAIL,
    ACCEPT_SUCCESS,
    ACCEPT_FAIL
} from '../types';

export default (state, action) => {
    switch(action.type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload
            }
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                token: action.payload.token
            }
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case REQUEST_FAIL:
        case OFFER_FAIL:
        case CANCEL_FAIL:
        case REJECT_FAIL:
        case ACCEPT_FAIL:
        case LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                user: null,
                offers: null,
                token: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload
            }
        case REQUEST_SUCCESS:
        case CANCEL_SUCCESS:
        case REJECT_SUCCESS:
        case ACCEPT_SUCCESS:
            return {
                ...state,
                user: state.user.map(user => user.id === action.payload.id ? action.payload : user),
                loading: false
            }
        case OFFER_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                offers: action.payload,
                loading: false
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
};
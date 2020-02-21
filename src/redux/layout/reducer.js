import { ACTIVATE_AUTH_LAYOUT, ACTIVATE_NON_AUTH_LAYOUT, IS_LARGE, SET_ACCESS,SET_INFO } from './actionTypes';

const initialState = {
    topbar: true,
    sidebar: true,
    footer: true,
    is_large_state: false,
    adminAccess: [],
    siteInfo: {}
}

const layout = (state = initialState, action) => {
    switch (action.type) {
        case ACTIVATE_AUTH_LAYOUT:
            state = {
                ...state,
                ...action.payload
            }
            break;
        case ACTIVATE_NON_AUTH_LAYOUT:
            state = {
                ...state,
                ...action.payload
            }
            break;
        case IS_LARGE:
            state = {
                ...state,
                is_large_state: action.payload
            }
            break;
        case SET_ACCESS:
            state = {
                ...state,
                adminAccess: action.payload
            }
            break;
        case SET_INFO:
            state = {
                ...state,
                siteInfo: action.payload
            }
            break;

        default:
            state = { ...state };
            break;
    }
    return state;
}

export default layout;
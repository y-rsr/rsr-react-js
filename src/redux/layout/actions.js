import { ACTIVATE_AUTH_LAYOUT, ACTIVATE_NON_AUTH_LAYOUT, IS_LARGE, SET_ACCESS, SET_INFO } from './actionTypes';

export const activateAuthLayout = () => {
    return {
        type: ACTIVATE_AUTH_LAYOUT,
        payload: {
            topbar: true,
            sidebar: true,
            footer: true,
            layoutType: 'Auth'
        }
    }
}

export const activateNonAuthLayout = () => {
    return {
        type: ACTIVATE_NON_AUTH_LAYOUT,
        payload: {
            topbar: false,
            sidebar: false,
            footer: false,
            layoutType: 'NonAuth',
            adminAccess: []
        }
    }
}

export const isLarge = (isToggle) => {
    return {
        type: IS_LARGE,
        payload: isToggle
    }
}
export const SetAdminAccess = (access) => {
    return {
        type: SET_ACCESS,
        payload: access
    }
}
export const SetSiteInfo = (info) => {
    return {
        type: SET_INFO,
        payload: info
    }
}




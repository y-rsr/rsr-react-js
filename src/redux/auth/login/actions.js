import { CHECK_LOGIN, LOGIN_USER_SUCCESSFUL, API_FAILED, CHECK_OTP, VALIDATE_OTP_SUCCESS, VALIDATE_OTP_ERROR, CLEARVALUE } from './actionTypes';

export const checkLogin = (result, history) => {
    return {
        type: CHECK_LOGIN,
        payload: { result, history }
    }
}
export const ClearStore = () => {
    return {
        type: CLEARVALUE
    }
}

export const checkOtp = (user_id, otp, history) => {
    return {
        type: CHECK_OTP,
        payload: { user_id, otp, history }
    }
}

export const validateOtpSuccess = (user) => {
    return {
        type: VALIDATE_OTP_SUCCESS,
        payload: user
    }
}

export const validateOtpError = (error) => {
    return {
        type: VALIDATE_OTP_ERROR,
        payload: error
    }
}


export const loginUserSuccessful = (user) => {
    return {
        type: LOGIN_USER_SUCCESSFUL,
        payload: user
    }
}

export const apiError = (error) => {
    return {
        type: API_FAILED,
        payload: error
    }
}
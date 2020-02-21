import { takeEvery, fork, put, all, } from 'redux-saga/effects';
import request from '../../../helpers/api'
import { NotificationManager } from '../../../components/ReactNotifications'
// Login Redux States
import { FORGET_USER } from './actionTypes';
import { apiError } from './actions';

// AUTH related methods
// import { postForgetPwd } from '../../../helpers/authUtils';

//If user is login then dispatch redux action's are directly from here.
function* forgetUser({ payload: { username, history } }) {
    try {
        request({
            url: '/api/admin/forgot',
            method: 'POST',
            data: {
                email: username,
            }
        }).then(res => {
            NotificationManager.success('Link Sent to mail Successfully!', 'SUCCESS', 3000, null, null, 'filled', 'check-circle')
        }).catch(err => {
            if (err && (err.status === 401 || err.status === 404)) {
                NotificationManager.error(err.data[0].msg || 'Invalid Credentials', 'ERROR', 3000, null, null, 'filled', 'times-circle')
            }
        })
    } catch (error) {
        yield put(apiError(error));
    }
}

export function* watchUserForget() {
    yield takeEvery(FORGET_USER, forgetUser)
}

function* forgetSaga() {
    yield all([fork(watchUserForget)]);
}

export default forgetSaga;
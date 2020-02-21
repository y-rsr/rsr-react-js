import { takeEvery, fork, put, all } from 'redux-saga/effects';
import { NotificationManager } from '../../../components/ReactNotifications'
// Login Redux States
import { CHECK_LOGIN } from './actionTypes';
import { apiError, loginUserSuccessful } from './actions';

// AUTH related methods
import { setLoggeedInUser } from '../../../helpers/authUtils';
import { SetAdminAccess } from '../../layout/actions';

//If user is login then dispatch redux action's are directly from here.
function* loginUser({ payload: { result, history } }) {
    try {
        if (result && result.result && result.result.admintype === "subadmin") {
            yield put(SetAdminAccess(result.result.privileges))
        }
        setLoggeedInUser(result.token)
        yield put(loginUserSuccessful(result.result));
        NotificationManager.success('Login Successfully', 'SUCCESS', 3000, null, null, 'filled', 'check-circle')
        history.push('/admin/dashboard')
        
    } catch (error) {
        yield put(apiError(error));
    }
}

export function* watchUserLogin() {
    yield takeEvery(CHECK_LOGIN, loginUser)
}

function* loginSaga() {
    yield all([fork(watchUserLogin)]);
}

export default loginSaga;
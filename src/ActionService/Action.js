// import * as userActions from './Login'

// const allActions = {
//     userActions
// }

// export default
import * as types from '../Const/ActionType'

export const actLogout = () => {
    return {
        type: types.LOGOUT_ACCOUNT,
    }
}

export const actLogin = (data) => {
    return {
        type: types.LOGIN_ACCOUNT,
        data: data
    }
}

export const actSaveInfo = (data) => {
    return {
        type: types.SAVE_INFO,
        data: data
    }
}



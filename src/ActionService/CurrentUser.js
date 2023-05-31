import * as types from './../Const/ActionType'

var data = JSON.parse(localStorage.getItem('USER'))
var initState = data ? data : {}

const currentUser = (state = initState, action) => {
    var newState = { ...state }
    switch (action.type) {
        case types.LOGIN_ACCOUNT:
            newState = action.data;
            localStorage.setItem("USER", JSON.stringify(newState));
            return newState;
        case types.LOGOUT_ACCOUNT:
            newState = {};
            localStorage.clear("USER");
            localStorage.clear("VERIFY");
            localStorage.clear("DATA-VERIFY");
            return newState;
        case types.UPDATE_USER_INFO:
            newState = { ...newState, userInfo: action.data };
            localStorage.setItem("USER", JSON.stringify(newState));
            return newState;
        case types.SAVE_INFO:
            newState = { ...newState, userInfo: action.data };
            localStorage.setItem("USER", JSON.stringify(newState));
            return newState;
        default:
            return state;
    }

}

export default currentUser;

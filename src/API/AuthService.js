
let history = null
// let token = JSON.parse(localStorage.getItem('USER')) ? JSON.parse(localStorage.getItem('USER'))['accessToken'] : null
let token = null
// let token = localStorage.setItem('user', JSON.stringify(user))
let store = null;
let auth = {
    setToken: () => {
        token = JSON.parse(localStorage.getItem("USER")) ? JSON.parse(localStorage.getItem("USER"))["accessToken"] : null;
    },
    getToken: () => {
        return JSON.parse(localStorage.getItem("USER")) ? JSON.parse(localStorage.getItem("USER"))["accessToken"] : null;
    },
    getUserInfo: () => {
        return JSON.parse(localStorage.getItem("USER")) ? JSON.parse(localStorage.getItem("USER"))["userInfo"] : null;
    },
    getVerify: () => {
        return JSON.parse(localStorage.getItem("USER")) ? JSON.parse(localStorage.getItem("VERIFY")) : null;
    },
    getDataVerify: () => {
        return JSON.parse(localStorage.getItem("USER")) ? JSON.parse(localStorage.getItem("DATA-VERIFY")) : null;
    },
    setHistory: (newHistory) => {
        history = newHistory
    },
    getHistory: () => {
        return history
    },
    setObjectMap: (object) => {
        localStorage.setItem("objectMap", JSON.stringify(object));
    },
    getObjectMap: () => {
        return JSON.parse(localStorage.getItem("objectMap"));
    },
}
export default auth;

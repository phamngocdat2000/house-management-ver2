
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
        return JSON.parse(localStorage.getItem("VERIFY")) ? JSON.parse(localStorage.getItem("VERIFY")) : null;
    },
    getDataVerify: () => {
        if (localStorage.getItem("DATA-VERIFY") !== "undefined" && localStorage.getItem("DATA-VERIFY") !== undefined) {
            return JSON.parse(localStorage.getItem("DATA-VERIFY")) ? JSON.parse(localStorage.getItem("DATA-VERIFY")) : null;
        }
    },
    getListUser: () => {
        return JSON.parse(localStorage.getItem("LIST-USER")) ? JSON.parse(localStorage.getItem("LIST-USER")) : null;
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

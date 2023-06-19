import config from './Config';
import auth from './AuthService';
import notice from "../ActionService/Notice";

const method = {
    get: async (url) => {
        url = config.HOST + '/' + url
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth.getToken(),
            'Accept-Language': 'vi'
        }
        let response = await fetch(url, {
            crossDomain: true,
            method: 'GET',
            headers
        });
        let rs = await response.json();
        if (rs.code && rs.code === "UNAUTHORIZED") {
            return logoutUser();
        }
        switch (response.status) {
            case 200: return rs
            case 401: return logoutUser()
            default: {
                console.log('err')
                if (rs.code) {
                    throw (rs.description)
                }
                throw (rs.message)
            }
        }
    },
    post: async (data, url) => {
        console.log(JSON.stringify(data))
        url = config.HOST + '/' + url
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth.getToken(),
            'Accept-Language': 'vi',
        }
        try {
            let response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });

            let rs = await response.json();
            if (rs.code && rs.code === "UNAUTHORIZED") {
                return logoutUser();
            }
            switch (response.status) {
                case 200: return rs
                case 401: return logoutUser()
                default: {
                    console.log(rs)
                    if (rs.message) {
                        throw (rs.message)
                    }
                    if (rs.description) {
                        throw (rs.description)
                    }
                    throw (rs)
                }
            }
        } catch (error) {
            console.log(error)
            if (error.msg) {
                console.log(error.msg)
            }
            throw error
        }
    },
    postForm: async (data, url) => {
        url = config.HOST + '/' + url
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth.getToken(),
            'Accept-Language': 'vi',
        }
        try {
            let response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });
            if (response.code && response.code === "UNAUTHORIZED") {
                return logoutUser();
            }
            switch (response.status) {
                case 200: return response
                case 401: return logoutUser()
                default: {
                    await response.json().then((data) => {
                        throw (data)
                    })
                }
            }
        } catch (error) {
            console.log(error)
            if (error.description) {
               throw error.description
            } else {
                throw error.toString()
            }
        }
    },
    delete: async (url) => {
        url = config.HOST + '/' + url
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth.getToken(),
            'Accept-Language': 'vi'
        }
        return await fetch(url, {
            crossDomain: true,
            method: 'DELETE',
            headers
        })
        // switch (response.status) {
        //     case 200: return response.status
        //     case 401: return logoutUser()
        //     default: {
        //         let rs = await response.json();
        //         console.log('err')
        //         throw (rs.message)
        //     }
        // }
    },
    put: async (data, url) => {
        url = config.HOST + '/' + url
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth.getToken(),
            'Accept-Language': 'vi'
        }
        try {
            let response = await fetch(url, {
                crossDomain: true,
                method: 'PUT',
                headers,
                'Accept-Language': 'vi',
                body: JSON.stringify(data),
            });
            let rs = await response.json();
            switch (response.status) {
                case 200: return rs
                case 401: return logoutUser()
                default: {
                    console.log('err')
                    if (rs.message) {
                        throw (rs.message)
                    }
                    if (rs.description) {
                        throw (rs.description)
                    }
                    throw (rs)
                }
            }
        } catch (error) {
            console.log(error)
            if (error.msg) {
                console.log(error.msg)
            }
            throw error

        }
    },
    patch: async (data, url) => {
        url = config.HOST + '/' + url
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth.getToken(),
            'Accept-Language': 'vi'
        }
        try {
            let response = await fetch(url, {
                crossDomain: true,
                method: 'PATCH',
                headers,
                'Accept-Language': 'vi',
                body: JSON.stringify(data),
            });
            let rs = await response.json();
            if (rs.code && rs.code === "UNAUTHORIZED") {
                return logoutUser();
            }
            switch (response.status) {
                case 200: return rs
                case 401: return logoutUser()
                default: {
                    console.log('err')
                    if (rs.message) {
                        throw (rs.message)
                    }
                    if (rs.description) {
                        throw (rs.description)
                    }
                    throw (rs)
                }
            }
        } catch (error) {
            console.log(error)
            if (error.msg) {
                console.log(error.msg)
            }
            throw error

        }
    },
}
function logoutUser() {
    notice.err('Phiên đăng nhập đã hết hạn')
    localStorage.clear('USER')
    window.location.href = "/";
}
export default method
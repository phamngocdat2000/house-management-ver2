import method from './Method';
import config from './Config';

let service = {
    login: params => {
        let url = "api/auth/login";
        return method.post(params, url);
    },
    register: params => {
        let url = "api/user";
        return method.post(params, url);
    },
    editUser: params => {
        let url = "api/user";
        return method.patch(params, url);
    },
    forgot: params => {
        let url = "api/auth/reset-pass";
        return method.postForm(params, url);
    },
    change: params => {
        let url = "api/auth/change-password";
        return method.postForm(params, url);
    },
    sendMail: (params, username) => {
        let url = "api/auth/forgot-mail/user/" + username;
        return method.postForm(params, url);
    },
    loginWithGoogle: () => {
        let url = "oauth2/authorization/google";
        window.location.href = config.HOST + '/' + url;
    },
    loginWithFacebook: () => {
        let url = "oauth2/authorization/facebook";
        window.location.href = config.HOST + '/' + url;
    },
    logoutApi: params => {
        let url = "user/logout";
        return method.post(params, url);
    },
    currentUser: () => {
        let url = "api/user";
        return method.get(url);
    },
    postContent: params => {
        let url = "api/post";
        return method.post(params, url);
    },
    getSearch: params => {
        let url = "api/search/address?" + params;
        return method.get(url);
    },
    getHouse: params => {
        let url = "api/search/houses?" + params;
        return method.get(url);
    },
    getInfoPost: id => {
        let url = "api/post/" + id;
        return method.get(url);
    },
    getHouseFilter: params => {
        let url = "api/search/houses/address-title?" + params;
        return method.get(url);
    },
    getDistrict: () => {
        let url = "api/address/district?city=Thành phố Hà Nội";
        return method.get(url);
    },
    getStreet: params => {
        let url = "api/address/street?district=" + params;
        return method.get(url);
    },
    getComment: id => {
        let url = "api/comment/post/" + id;
        return method.get(url);
    },
    getRating: params => {
        let url = "api/rating/user/" + params;
        return method.get(url);
    },
    rating: (username, params) => {
        let url = "api/rating/user/" + username;
        return method.post(params, url)
    },
    updateRating: (id, params) => {
        let url = "api/rating/" + id;
        return method.put(params, url)
    },
    comment: (id, params) => {
        let url = "api/comment/post/" + id;
        return method.post(params, url)
    },
    editPost: (id, params) => {
        let url = "api/post/" + id;
        return method.patch(params, url)
    },
    deletePost: (id) => {
        let url = "api/post/" + id;
        return method.delete(url)
    },
    getPostByUsername: username => {
        let url = "api/posts/user/" + username;
        return method.get(url);
    },
    getUser: username => {
        let url = "api/user/" + username;
        return method.get(url);
    },
    createVerifyUser: (params) => {
        let url = "api/verify-user";
        return method.post(params, url)
    },
    updateVerifyUser: (params) => {
        let url = "api/verify-user";
        return method.patch(params, url)
    },
    getUserVerify: () => {
        let url = "api/verify-user";
        return method.get(url);
    },
    getListUserVerify: () => {
        let url = "api/verifies-user?page_index=1&page_size=20";
        return method.get(url);
    },
    acceptVerify: (username, params) => {
        let url = "api/verify-user/accept/" + username;
        return method.postForm(params, url)
    },
    getAllUserWithAdmin: () => {
        let url = "api/admin/users";
        return method.get(url);
    },
    banUserWithAdmin: (params) => {
        let url = "api/admin/ban";
        return method.post(params, url);
    },
};

export default service;

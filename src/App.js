import './App.css';
import MapContainer from "./Component/Map/MapContainer";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./Component/Login/Login";
import React, {Component} from "react";
import Header from "./Component/HomePage/Header";
import Body from "./Component/HomePage/Body";
import {LoginNotFound} from "./Component/Login/LoginNotFound";
import PostInfo from "./Component/Info/PostInfo";
import {Footer} from "./Component/HomePage/Footer";
import ClickChooseLocation from "./Component/Map/ClickChooseLocation";
import ManagePostInfo from "./Component/Info/ManagePostInfo";
import VerifyUserAfterRegister from "./Component/Info/VerifyUserAfterRegister";
import auth from "./API/AuthService";
import service from "./API/Service";
import ManageUser from "./Component/Info/ManageUser";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import UserProfile from "./Component/Info/UserProfile";

export default class HouseManagement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: !!JSON.parse(localStorage.getItem('USER')),
            loggedInUserObj: JSON.parse(localStorage.getItem('USER')) ? {username: JSON.parse(localStorage.getItem('USER'))['userInfo']} : {},
            accountStatus: "",
            dataAccount: {},
            listUserVerify: [],
            listUserActive: [],
            listUserInActive: [],
            listUser: [],
            listAllUser: []
        }
        this.setLoggedInUser = this.setLoggedInUser.bind(this)
    }

    componentDidMount = async () => {
        if (auth.getUserInfo()) {
            await service.getUser(auth.getUserInfo().username).then((data) => {
                console.log(data)
                localStorage.setItem("VERIFY", JSON.stringify(data));
                this.setState({
                    dataAccount: data,
                    accountStatus: data.status
                })
            })
            await service.getUserVerify().then((data) => {
                console.log(data)
                localStorage.setItem("DATA-VERIFY", JSON.stringify(data));
            }).catch((error) => {
                console.log(error)
            })
        }
        if (auth.getUserInfo() && auth.getUserInfo().username === "admin") {
            await service.getListUserVerify().then(async (data) => {
                console.log(data);
                this.setState({listUserVerify: data})
                localStorage.setItem("LIST-USER", JSON.stringify(data));
            }).catch((error) => {
                console.log(error)
            })
        }
        if (auth.getUserInfo() && auth.getUserInfo().username === "admin") {
            await service.getAllUserWithAdmin().then(data => {
                this.setState({
                    listAllUser: data
                })
                const listUserActive = [];
                const listUserInActive = [];
                const listUser = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].active) {
                        if (data[i].isVerified) {
                            if (auth.getUserInfo())
                                listUserActive.push(data[i])
                        } else {
                            listUser.push(data[i])
                        }
                    } else {
                        listUserInActive.push(data[i])
                    }
                }
                this.setState({
                    listUserActive: listUserActive,
                    listUser: listUser,
                    listUserInActive: listUserInActive
                })
            })
        }

    }

    banAccount = async () => {
        if (auth.getUserInfo() && auth.getUserInfo().username === "admin") {
            await service.getAllUserWithAdmin().then(data => {
                const listUserActive = [];
                const listUserInActive = [];
                const listUser = [];
                for (let i = 0; i < data.length; i++) {
                    console.log(data[i])
                    if (data[i].active) {
                        if (data[i].isVerified) {
                            if (auth.getUserInfo())
                                listUserActive.push(data[i])
                        } else {
                            listUser.push(data[i])
                        }
                    } else {
                        listUserInActive.push(data[i])
                    }
                }
                this.setState({
                    listUserActive: listUserActive,
                    listUser: listUser,
                    listUserInActive: listUserInActive
                })
            })
        }
    }

    setLoggedInUser(loggedInUserObj) {
        this.setState({isLoggedIn: true, loggedInUserObj: {...loggedInUserObj}})
    }

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Routes>
                        <Route path="/"
                               element={
                                   <>
                                       <Header accountStatus={this.state.accountStatus}
                                               loggedInUserObj={this.state.loggedInUserObj}/>
                                       <Body/>
                                       <Footer/>
                                   </>
                               }>

                        </Route>
                        {!this.state.isLoggedIn ?
                            <Route path="/login"
                                   element={
                                       <Login loginProp={this.setLoggedInUser}/>
                                   }/> :
                            <Route path="/login" element={<LoginNotFound/>}/>
                        }
                        {!this.state.isLoggedIn ?
                            <Route path="/restpassword"
                                   element={
                                       <Login isForgot={true} loginProp={this.setLoggedInUser}/>
                                   }/> :
                            <Route path="/restpassword" element={<LoginNotFound/>}/>
                        }
                        <Route>
                            <Route path="/location"
                                   element={
                                       <>
                                           <Header accountStatus={this.state.accountStatus}
                                                   loggedInUserObj={this.state.loggedInUserObj}/>
                                           <MapContainer></MapContainer>
                                           <Footer/>
                                       </>

                                   }/>
                        </Route>
                        <Route>
                            <Route path="/choose-location"
                                   element={
                                       <>
                                           <ClickChooseLocation></ClickChooseLocation>
                                       </>

                                   }/>
                        </Route>
                        <Route>
                            <Route path="/info/house"
                                   element={
                                       <>
                                           <Header accountStatus={this.state.accountStatus}
                                                   loggedInUserObj={this.state.loggedInUserObj}/>
                                           <PostInfo></PostInfo>
                                           <Footer/>
                                       </>

                                   }/>
                        </Route>
                        <Route path="/change-password"
                               element={
                                   <Login changepassword={true}/>
                               }/>
                        <Route path="/manage-house"
                               element={
                                   <>
                                       <Header accountStatus={this.state.accountStatus}
                                               loggedInUserObj={this.state.loggedInUserObj}/>
                                       <ManagePostInfo></ManagePostInfo>
                                       <Footer/>
                                   </>

                               }/>
                        {this.state.loggedInUserObj.username && this.state.loggedInUserObj.username.username === "admin" ?
                            <Route path="/manage-account"
                                   element={
                                       <>
                                           <Header accountStatus={this.state.accountStatus}
                                                   loggedInUserObj={this.state.loggedInUserObj}/>
                                           <ManageUser listAllUser={this.state.listUser}
                                                       listAllUserActive={this.state.listUserActive}
                                                       listAllUserInActive={this.state.listUserInActive}
                                                       listUser={this.state.listUserVerify}
                                                       banAccount={this.banAccount}></ManageUser>
                                           <Footer/>
                                       </>

                                   }/> :
                            <Route path="/manage-account" element={<LoginNotFound/>}/>
                        }
                        {this.state.isLoggedIn ?
                            <Route path="/verify"
                                   element={
                                       <VerifyUserAfterRegister
                                           dataAccount={this.state.dataAccount}></VerifyUserAfterRegister>
                                   }/> :
                            <Route path="/verify" element={<LoginNotFound/>}/>
                        }
                        {this.state.isLoggedIn ?
                            <Route path="/verify-update"
                                   element={
                                       <VerifyUserAfterRegister
                                           dataAccount={this.state.dataAccount}></VerifyUserAfterRegister>
                                   }/> :
                            <Route path="/verify-update" element={<LoginNotFound/>}/>
                        }
                        {this.state.loggedInUserObj.username && this.state.loggedInUserObj.username.username === "admin"
                        && this.state.listUserVerify ?
                            <Route path="/access"
                                   element={
                                       <VerifyUserAfterRegister
                                           dataUser={this.state.listUserVerify}
                                           dataAccount={this.state.dataAccount}>
                                       </VerifyUserAfterRegister>
                                   }/>
                            :
                            <Route path="/access" element={<LoginNotFound/>}/>
                        }
                        {this.state.loggedInUserObj.username && this.state.loggedInUserObj.username.username !== "admin"
                            &&
                            <Route path="/change-info"
                                   element={
                                       <UserProfile user={auth.getVerify()}>
                                       </UserProfile>
                                   }/>
                        }
                        {this.state.loggedInUserObj.username && this.state.loggedInUserObj.username.username === "admin"
                            &&
                            <Route path="/user-info"
                                   element={
                                       <UserProfile user={auth.getVerify()}
                                           listUser={this.state.listAllUser}>
                                       </UserProfile>
                                   }/>
                        }
                    </Routes>
                </BrowserRouter>
                <ToastContainer/>
            </div>
        );
    }
}

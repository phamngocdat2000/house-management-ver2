import './App.css';
import MapContainer from "./Component/Map/MapContainer";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./Component/Login/Login";
import {Component} from "react";
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

export default class HouseManagement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: !!JSON.parse(localStorage.getItem('USER')),
            loggedInUserObj: JSON.parse(localStorage.getItem('USER')) ? {username: JSON.parse(localStorage.getItem('USER'))['userInfo']} : {},
            accountStatus: "",
            dataAccount: {},
            listUserVerify: []
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
                this.setState({listUserVerify:data})
                localStorage.setItem("LIST-USER", JSON.stringify(data));
            }).catch((error) => {
                console.log(error)
            })
        }

    }

    setLoggedInUser(loggedInUserObj) {
        this.setState({isLoggedIn: true, loggedInUserObj: {...loggedInUserObj}})
    }

    render() {
        console.log(this.state.listUserVerify)
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
                                       <ManageUser listUser={this.state.listUserVerify}></ManageUser>
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
                    </Routes>
                </BrowserRouter>
            </div>
        );
    }
}

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

export default class HouseManagement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: !!JSON.parse(localStorage.getItem('USER')),
            loggedInUserObj: JSON.parse(localStorage.getItem('USER')) ? {username: JSON.parse(localStorage.getItem('USER'))['userInfo']} : {}
        }
        this.setLoggedInUser = this.setLoggedInUser.bind(this)
    }

    setLoggedInUser(loggedInUserObj) {
        this.setState({isLoggedIn: true, loggedInUserObj: {...loggedInUserObj}})
    }

    render() {
        console.log(this.state.isLoggedIn)
        return (
            <div className="App">
                <BrowserRouter>
                    <Routes>
                        <Route path="/"
                               element={
                                   <>
                                       <Header loggedInUserObj={this.state.loggedInUserObj}/>
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
                                           <Header loggedInUserObj={this.state.loggedInUserObj}/>
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
                                           <Header loggedInUserObj={this.state.loggedInUserObj}/>
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
                                       <Header loggedInUserObj={this.state.loggedInUserObj}/>
                                       <ManagePostInfo></ManagePostInfo>
                                       <Footer/>
                                   </>

                               }/>
                    </Routes>
                </BrowserRouter>
            </div>
        );
    }
}

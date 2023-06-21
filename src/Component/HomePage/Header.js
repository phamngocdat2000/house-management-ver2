import React, {Component} from 'react'

// importing material UI components
import AppBar from "@mui/material/AppBar";
import {Button, Menu, MenuItem} from "@mui/material";
import service from '../../API/Service';
import '../../CSS/header.css';
import {DownOutlined} from "@ant-design/icons";
import Popup from "reactjs-popup";
import iconAccount from '../../Image/icon-account.png';
import PopupPost from "../Popup/PopupPost";
import ClickChooseLocation from "../Map/ClickChooseLocation";
import auth from "../../API/AuthService";
import { toast } from 'react-toastify';
import notice from "../../ActionService/Notice";


export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorManagement: null, anchorProfile: null, keyWord: "", showModal: true, showDropdown: false,
            isPopupOpen: false, isMapOpen: false, lat: "", lng: "", address: ""
        };
    }

    handleLogout() {
        service.logoutApi().then(r => console.log(r));
        localStorage.clear()
        window.location.href = "/";
    }

    handleLogin() {
        window.location.href = "/login";
    }

    handleHoverManagement(event) {
        if (this.state.anchorManagement !== event.currentTarget) {
            this.setState({anchorManagement: event.currentTarget});
        }
    }

    handleCloseManagement() {
        this.setState({anchorManagement: null});
    }

    handleHoverProfile(event) {
        if (this.state.anchorProfile !== event.currentTarget) {
            this.setState({anchorProfile: event.currentTarget});
        }
    }

    handleCloseProfile() {
        this.setState({anchorProfile: null});
    }

    handleMenuItemClick = (menuItem) => {
        this.handleCloseManagement();
        if (menuItem === "Đăng bài") {
            let roleAdmin = false;
            // eslint-disable-next-line array-callback-return
            auth.getVerify() && auth.getVerify().authorities.map(data => {
                if (data.role === 'ROLE_ADMIN') {
                    roleAdmin = true;
                    this.setState({isPopupOpen: true});
                }
            })
            if (auth.getVerify() && !auth.getVerify().isVerified && auth.getDataVerify() && !roleAdmin) {
                notice.inf("Vui lòng đợi admin duyệt trong 24h");
                return;
            }
            if (auth.getVerify() && !auth.getVerify().isVerified && !roleAdmin) {
                notice.inf("Vui lòng cập nhật ảnh CMND/CCCD và nhận diện gương mặt");
                return;
            }
            this.setState({isPopupOpen: true}); // Đặt giá trị state để mở Popup
        } else if (menuItem === "Quản lý") {
            let roleAdmin = false;
            // eslint-disable-next-line array-callback-return
            auth.getVerify() && auth.getVerify().authorities.map(data => {
                if (data.role === 'ROLE_ADMIN') {
                    roleAdmin = true;
                    window.location.href = "/manage-house";
                }
            })
            if (!auth.getVerify().isVerified && auth.getDataVerify() && !roleAdmin) {
                notice.inf("Vui lòng đợi admin duyệt trong 24h");
                return;
            }
            if (!auth.getVerify().isVerified && !roleAdmin) {
                notice.inf("Vui lòng cập nhật ảnh CMND/CCCD và nhận diện gương mặt");
                return;
            }
            window.location.href = "/manage-house"
            // Xử lý hành động cho "Quản lý" ở đây
        }
    };

    handlePopupOpen = (popup, mapopen) => {
        // Cập nhật state của Header với giá trị address nhận được từ AddressInput
        this.setState({isPopupOpen: popup});
        this.setState({isMapOpen: mapopen});
    }

    handleMapDone = (lat, lng, address) => {
        // Cập nhật state của Header với giá trị address nhận được từ AddressInput
        this.setState({
            lat: lat,
            lng: lng,
            address: address
        })
    }

    handlePopupClose = () => {
        this.setState({isPopupOpen: false}); // Đặt giá trị state để đóng Popup
    };

    handleClickItem = (url) => {
        window.location.href = url
    }

    scrollToId = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    render() {
        let show = false;
        if (this.props.loggedInUserObj.username && auth.getVerify() && auth.getVerify().isVerified) {
            show = true;
        }
        return (
            <div id="main-header" className="main-header">
                <AppBar position="static" className="header-app-bar">
                    <div className="menu-bar">
                        <div className="logo-project">
                            <a className="text-logo" href='/'>
                                <p>
                                    NestAway
                                </p>
                                <p style={{fontSize: "20px", marginTop: "-1rem"}}>
                                    Product
                                </p>
                            </a>
                        </div>
                        <div className="items">
                            <button className="home" onClick={() => this.handleClickItem("/")}>Trang chủ</button>
                            {this.props.loggedInUserObj.username &&
                                <div>
                                    <button
                                        className="home"
                                        style={{display: "flex"}}
                                        aria-owns={this.state.anchorManagement ? "simple-menu" : undefined}
                                        aria-haspopup="true"
                                        onClick={(e) => this.handleHoverManagement(e)}
                                    >
                                        <div>Đăng bài và quản lý</div>
                                        <DownOutlined style={{marginLeft: "0.5rem", marginTop: "2px"}}/>
                                    </button>
                                    <Menu
                                        id="simple-menu"
                                        className="simple-menu"
                                        anchorEl={this.state.anchorManagement}
                                        open={Boolean(this.state.anchorManagement)}
                                        onClose={() => this.handleCloseManagement()}
                                        MenuListProps={{onMouseLeave: () => this.handleCloseManagement()}}
                                    >
                                        <div className="items-app-bar">
                                            <MenuItem className="item-app-bar"
                                                      onClick={() => this.handleMenuItemClick("Đăng bài")}>
                                                Đăng bài</MenuItem>
                                            <MenuItem className="item-app-bar"
                                                      onClick={() => this.handleMenuItemClick("Quản lý")}>
                                                Quản lý</MenuItem>
                                        </div>
                                    </Menu>
                                    <div className={this.state.isPopupOpen ? "djask-123-main" : "djask-123-main-none"}>
                                        <div className="djask-123">
                                            <div onClick={this.handlePopupClose} className="djask-124">x</div>
                                            <PopupPost handleOpenPopup={this.handlePopupOpen}
                                                       lat={this.state.lat}
                                                       lng={this.state.lng}
                                                       address={this.state.address}
                                            />
                                        </div>
                                    </div>
                                    <div className={this.state.isMapOpen ? "djask-123-main" : "djask-123-main-none"}>
                                        <ClickChooseLocation
                                            handleOpenPopup={this.handlePopupOpen}
                                            handleMapDone={this.handleMapDone}
                                        />
                                    </div>
                                </div>}
                            <button className="home" onClick={() => this.handleClickItem("/location")}>Bản đồ</button>
                            <button className="home" onClick={() => this.scrollToId("footer")}>Thông tin liên hệ
                            </button>
                        </div>
                    </div>
                    <div className="profile">
                        {this.props.loggedInUserObj.username === undefined && <div style={{
                            "display": "flex", "justifyContent": "flex-end", "alignItems": "center", "padding": "31px 0"
                        }}>
                            <div className="btn-login-logout">
                                <Button color="inherit" onClick={() => this.handleLogin()}>Đăng nhập</Button>
                            </div>
                        </div>}
                        {this.props.loggedInUserObj.username !== undefined && <div style={{
                            "display": "flex", "justifyContent": "center", "alignItems": "center", "padding": "31px 0"
                        }}
                        >
                            <button
                                className="home-2"
                                style={{display: "flex"}}
                                aria-owns={this.state.anchorProfile ? "user-profile-menu" : undefined}
                                aria-haspopup="true"
                                onClick={(e) => this.handleHoverProfile(e)}
                            >
                                <div
                                    className="user-profile"
                                >
                                    <img src={this.props.loggedInUserObj.username.avatar !== undefined ?
                                        this.props.loggedInUserObj.username.avatar : iconAccount
                                    }
                                         alt=""></img>
                                    <div
                                        className="text-name"
                                        disable="true"
                                        color="inherit">{this.props.loggedInUserObj.username.fullName}</div>
                                    <DownOutlined style={{marginLeft: "0.5rem", marginTop: "2px"}}/>
                                </div>
                            </button>
                            <Menu
                                id="user-profile-menu"
                                className="user-profile-menu"
                                anchorEl={this.state.anchorProfile}
                                open={Boolean(this.state.anchorProfile)}
                                onClose={() => this.handleCloseProfile()}
                                MenuListProps={{onMouseLeave: () => this.handleCloseProfile()}}
                            >
                                <div className="items-app-bar2">
                                    {this.props.loggedInUserObj.username.username === 'admin' ?
                                        <MenuItem onClick={() => this.handleClickItem("/manage-account")}
                                                  className="item-app-bar3">
                                            Quản lý người dùng</MenuItem> :
                                        <>
                                            {auth.getDataVerify() ?
                                                <MenuItem onClick={() => this.handleClickItem("/verify-update")}
                                                          className="item-app-bar3">
                                                    Xác minh tài khoản</MenuItem> :
                                                <MenuItem onClick={() => this.handleClickItem("/verify")}
                                                          className="item-app-bar3">
                                                    Xác minh tài khoản</MenuItem>
                                            }
                                            <MenuItem className="item-app-bar3"
                                                      onClick={() => this.handleClickItem("/change-info")}>
                                                Cập nhật thông tin</MenuItem>
                                        </>
                                    }
                                    <MenuItem className="item-app-bar3"
                                              onClick={() => this.handleClickItem("/change-password")}>
                                        Đổi mật khẩu</MenuItem>
                                    <MenuItem className="item-app-bar3" onClick={() => this.handleLogout()}>
                                        Đăng xuất</MenuItem>
                                </div>
                            </Menu>
                            <Popup
                                // open={this.state.isPopupOpen} // Kiểm tra giá trị state để hiển thị Popup
                                // onClose={() => this.handlePopupClose()}
                                // overlayStyle={{ background: "rgba(0, 0, 0, 0.5)" }}
                                // contentStyle={popupStyles}
                            >
                                {/* Nội dung của Popup */}
                                {/*<PopupPost handleOpenPopup={this.handlePopupOpen} />*/}
                            </Popup>
                        </div>}
                    </div>
                </AppBar>
            </div>
        );
    }
}
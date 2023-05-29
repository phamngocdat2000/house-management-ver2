import React, {Component} from "react";
import '../../CSS/body.css';
import backgroundBody from '../../Image/background-body.svg';
import {Button, Menu, MenuItem} from "@mui/material";
import iconLocation from '../../Image/icon-location.png';
import {DownOutlined} from "@ant-design/icons";
import service from "../../API/Service";


export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorLocation: null,
            keyWord: "",
            showModal: true,
            showDropdown: false,
            area: "Nhập khu vực muốn tìm kiếm",
            isArea: true,
            location: "",
            isLocation: false,
            type: "",
            listAddress: [],
            address: "",
            isDropDown: true,
            selectedAddressIndex: -1
        };
    }

    handleInputKeyDown = async (event) => {
        const { listAddress, selectedAddressIndex } = this.state;
        if (event.key === 'ArrowDown') { // Nếu nhấn phím mũi tên xuống
            event.preventDefault(); // Ngăn chặn hành động mặc định của phím này (chuyển con trỏ xuống dòng mới)
            const newIndex = Math.min(selectedAddressIndex + 1, listAddress.length - 1); // Tăng vị trí của địa chỉ được chọn lên 1, nhưng không vượt quá số lượng địa chỉ trong danh sách
            this.setState({ selectedAddressIndex: newIndex }, () => {
                const selectedAddressElement = document.getElementById(`address-${selectedAddressIndex}`);
                console.log(`address-${selectedAddressIndex}`)
                console.log(selectedAddressElement);
                if (selectedAddressElement) {
                    selectedAddressElement.scrollIntoView({ block: "nearest" });
                }
            }); // Cập nhật lại vị trí của địa chỉ được chọn
        } else if (event.key === 'ArrowUp') { // Nếu nhấn phím mũi tên lên
            event.preventDefault();
            const newIndex = Math.max(selectedAddressIndex - 1, 0
            ); // Giảm vị trí của địa chỉ được chọn xuống 1, nhưng không nhỏ hơn -1 (để không có địa chỉ nào được chọn)
            this.setState({ selectedAddressIndex: newIndex }, () => {
                const selectedAddressElement = document.getElementById(`address-${selectedAddressIndex}`);
                console.log(`address-${selectedAddressIndex}`)
                console.log(selectedAddressElement);
                if (selectedAddressElement) {
                    selectedAddressElement.scrollIntoView({ block: "nearest" });
                }
            });
        } else if (event.key === 'Enter') { // Nếu nhấn phím Enter
            event.preventDefault();
            if (selectedAddressIndex >= 0) { // Nếu có địa chỉ được chọn
                const selectedAddress = listAddress[selectedAddressIndex];
                await this.handleChooseAddress(selectedAddress); // Thực hiện hành động khi người dùng chọn địa chỉ
            }
            let keyWord, type;
            if (this.state.keyWord) {
                keyWord = "keyword=" + this.state.keyWord
            } else {
                keyWord = "";
            }
            if (this.state.type) {
                type = "type=" + this.state.type;
            } else {
                type = "";
            }
            window.location.href = `/location?${keyWord}&${type}`;
        }
    }

    async handleSearch(event) {
        this.setState({isDropDown: true})
        if (event) {
            await this.setState({keyWord: event});
        } else {
            await this.setState({keyWord: ""});
        }
        let keyWord, type;
        if (this.state.keyWord) {
            keyWord = "keyword=" + event
        }
        if (this.state.type) {
            type = "type=" + this.state.type;
        }
        await this.handleGetAddress(keyWord + "&" + type);
    }

    async handleGetAddress(params) {
        await service.getSearch(params)
            .then(data => this.setState({listAddress: data}));
    }

    handleRedirectChooseMap() {
        window.location.href = "/choose-location";
    }

    handleHoverLocation(event) {
        if (this.state.anchorLocation !== event.currentTarget) {
            this.setState({anchorLocation: event.currentTarget});
        }
    }

    handleCloseLocation() {
        this.setState({anchorLocation: null});
    }

    handleClickChooseArea = () => {
        this.setState({
            area: "Nhập khu vực muốn tìm kiếm",
            isArea: true,
            location: "",
            isLocation: false
        })
    }

    handleClickChooseLocation = () => {
        this.setState({
            area: "",
            isArea: false,
            location: "Nhập vị trí chỉ định muốn tìm kiếm",
            isLocation: true
        })
    }

    handleChooseType = (type) => {
        this.setState({type: type})
    }

    handleChooseAddress = (address) => {
        this.setState({
            keyWord: address,
            isDropDown: false
        })
    }

    render() {
        console.log(this.state.keyWord )
        console.log(this.state.listAddress)
        return (
            <div className="main-body">
                <div className="body1">
                    <div id="body-text1" className="body-text1">
                        <div id="body-text2">Nền tảng</div>
                        <div style={{marginTop: "1rem"}}>tra cứu nhà trọ khu vực Hà Nội</div>
                        <div className="all-button-body1">
                            <Button onClick={() => this.handleChooseType("APARTMENT")}
                                    className={this.state.type === "APARTMENT" ? "button-body2" : "button-body1"}>
                                Chung cư
                            </Button>
                            <Button onClick={() => this.handleChooseType("HOUSE_LAND")}
                                    className={this.state.type === "HOUSE_LAND" ? "button-body2" : "button-body1"}>
                                Nhà nguyên căn
                            </Button>
                            <Button onClick={() => this.handleChooseType("BEDSIT")}
                                    className={this.state.type === "BEDSIT" ? "button-body2" : "button-body1"}>
                                Phòng trọ
                            </Button>
                        </div>
                        <div className="search-container">
                            <div className="search-main">
                                <div className="location-search"
                                     style={{display: "flex"}}
                                     aria-owns={this.state.anchorLocation ? "simple-menu" : undefined}
                                     aria-haspopup="true"
                                     onClick={(e) => this.handleHoverLocation(e)}
                                >
                                    <img className="search-icon" src={iconLocation} alt=""/>
                                    <DownOutlined style={{fontSize: "1.5rem"}}/>
                                </div>
                                <Menu
                                    id="search-location-menu"
                                    className="search-location-menu"
                                    transformOrigin={{vertical: -10, horizontal: -5}}
                                    anchorEl={this.state.anchorLocation}
                                    open={Boolean(this.state.anchorLocation)}
                                    onClose={() => this.handleCloseLocation()}
                                    MenuListProps={{onMouseLeave: () => this.handleCloseLocation()}}
                                >
                                    <div className="items-app-bar">
                                        <MenuItem className="item-app-bar" onClick={() => this.handleClickChooseArea()}>
                                            Khu vực</MenuItem>
                                        <MenuItem className="item-app-bar"
                                                  onClick={() => this.handleClickChooseLocation()}>
                                            Vị trí chỉ định</MenuItem>
                                    </div>
                                </Menu>
                            </div>
                            <input onChange={event => this.handleSearch(event.target.value)}
                                   onKeyDown={this.handleInputKeyDown}
                                   onClick={event => this.handleSearch(event.target.value)}
                                   className={this.state.isLocation ? "search-input-2" : "search-input"} type="text"
                                   placeholder={this.state.area + this.state.location}
                                   value={this.state.keyWord}/>
                            {!this.state.isLocation ?
                                <button
                                    className="search-button"
                                    onClick={() => window.location.href = `/location?keyword=${this.state.keyWord}&type=${this.state.type}`}
                                >
                                    Tìm kiếm
                                </button> :
                                <div className="choose-location-on-map">
                                    <p>Bạn có thể chọn vị trí trên bản đồ?&nbsp;
                                        <span onClick={this.handleRedirectChooseMap}
                                              className='register-login2'>Tại dây</span>
                                    </p>
                                </div>
                            }
                        </div>
                        {this.state.keyWord && this.state.isDropDown && this.state.listAddress.length > 0 &&
                            <div className="get-address-main">
                                <div className="get-address">
                                    {this.state.listAddress.map((address, index) => (
                                        <button className={`get-address-children ${this.state.selectedAddressIndex === index ? 'selected' : ''}`}
                                                id={`address-${index}`}
                                                onClick={() => this.handleChooseAddress(address)}>
                                            {address}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        }
                    </div>
                    <img className="background-img-1" src={backgroundBody} alt=""/>
                </div>
            </div>
        )
    }
}




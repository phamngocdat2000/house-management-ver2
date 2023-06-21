import React, {Component} from "react";
import '../../CSS/map-style.css';
import iconSearch from "../../Image/icon-search-in-map.png"
import {DownOutlined} from "@ant-design/icons";
import {Menu, Checkbox, FormGroup, FormControlLabel} from "@mui/material";
import AddressInput from "./AddressInput";
import RangeSlider from "../Utils/RangeSlider";

export default class SearchMap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            keyWord: "",
            anchorModel: null,
            anchorNumberRoom: null,
            anchorPrice: null,
            anchorDistance: null,
            area: 1,
            location: 1,
            latitude: null,
            longitude: null,
            address: null,
            minPrice: null,
            maxPrice: null,
            selectedTypeValues: [],
            selectedRoomValues: [],
        };
    }

    handleCheckboxTypeChange = async (event) => {
        const { value, checked } = event.target;
        if (checked) {
            await this.setState((prevState) => ({
                selectedTypeValues: [...prevState.selectedTypeValues, value]
            }));
        } else {
            await this.setState((prevState) => ({
                selectedTypeValues: prevState.selectedTypeValues.filter((selectedValue) => selectedValue !== value)
            }));
        }
        await this.props.isTypes(this.state.selectedTypeValues);
    };

    handleCheckboxRoomChange = async (event) => {
        const { value, checked } = event.target;
        if (checked) {
            await this.setState((prevState) => ({
                selectedRoomValues: [...prevState.selectedRoomValues, value]
            }));
        } else {
            await this.setState((prevState) => ({
                selectedRoomValues: prevState.selectedRoomValues.filter((selectedValue) => selectedValue !== value)
            }));
        }
        await this.props.isRoom(this.state.selectedRoomValues);
    };

    handleHoverModel(event) {
        if (this.state.anchorModel !== event.currentTarget) {
            this.setState({anchorModel: event.currentTarget});
        }
    }

    handleCloseModel() {
        this.setState({anchorModel: null});
    }

    handleHoverNumberRoom(event) {
        if (this.state.anchorNumberRoom !== event.currentTarget) {
            this.setState({anchorNumberRoom: event.currentTarget});
        }
    }

    handleCloseNumberRoom() {
        this.setState({anchorNumberRoom: null});
    }

    handleHoverPrice(event) {
        if (this.state.anchorPrice !== event.currentTarget) {
            this.setState({anchorPrice: event.currentTarget});
        }
    }

    handleClosePrice() {
        this.setState({anchorPrice: null});
    }

    handleChooseAreaOrLocation = (type) => {
        if (type === "area") {
            this.setState({area: this.state.area + 1})
            if (this.state.location % 2 === 0) {
                this.setState({location: this.state.location - 1})
            }
        } else {
            this.setState({location: this.state.location + 1})
            if (this.state.area % 2 === 0) {
                this.setState({area: this.state.area - 1})
            }
        }
    }

    async handleSearch(event) {
        await this.props.isSearch(event);
    }

    async handleDistance(event) {
        await this.props.isSetDistance(event);
    }

    async handleMinPrice(value) {
        this.setState({minPrice:value[0]})
        await this.props.isSetMinPrice(value[0]);
    }

    async handleMaxPrice(value) {
        this.setState({maxPrice:value[1]})
        await this.props.isSetMaxPrice(value[1]);
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {

        }
    };

    handleAddressInputChanged = async (lat, lng, address) => {
        await this.setState({
            latitude: lat,
            longitude: lng,
            address: address
        })
        await this.props.isSetLocation(lat, lng, address);
        console.log(this.state.latitude)
        console.log(this.state.longitude)
        console.log(this.state.address)

    }

    render() {
        return (
            <>
                <div className="search-header">
                    <div className="background-btn-choose">
                        <button onClick={() => this.handleChooseAreaOrLocation("area")}
                                className={this.state.area % 2 === 0 ? "choose-area-or-location-2" : "choose-area-or-location"}>
                            Khu vực
                        </button>
                        <button onClick={() => this.handleChooseAreaOrLocation("location")}
                                className={this.state.location % 2 === 0 ? "choose-area-or-location-2" : "choose-area-or-location"}>
                            Vị trí
                        </button>
                    </div>

                    {this.state.area % 2 === 0 &&
                        <div className="search-text-in-map">
                            <input onChange={event => this.handleSearch(event.target.value)}
                                   onKeyDown={(event) => this.handleKeyDown(event)} className="search-input-in-map"
                                   type="text"
                                   placeholder="Nhập từ khoá để tìm kiếm"/>
                            <button
                                className="search-button-in-map"
                                onClick={() => window.location.href = "/search?keyword=" + this.state.keyWord}
                            >
                                <img className="icon-search-in-map" src={iconSearch} alt=""/>
                            </button>
                        </div>
                    }

                    {this.state.location % 2 === 0  &&
                        <>
                            <AddressInput onAddressChanged={this.handleAddressInputChanged}/>
                            <div className="distance-text-in-map">
                                <input onChange={event => this.handleDistance(event.target.value)}
                                       onKeyDown={(event) => this.handleKeyDown(event)}
                                       className="distance-input-in-map"
                                       type="number"
                                       placeholder="Khoảng cách (m)"/>
                            </div>
                        </>

                    }

                    <div className="other-select-main">
                        <div className="btn-other-select"
                             aria-owns={this.state.anchorPrice ? "simple-menu" : undefined}
                             aria-haspopup="true"
                             onClick={(e) => this.handleHoverPrice(e)}
                        >
                            <button className="other-select-in-map">Khoảng giá</button>
                            <DownOutlined className="drop-down-other-select"/>
                        </div>
                        <Menu
                            id="other-select-menu"
                            className="other-select-menu"
                            transformOrigin={{vertical: -10, horizontal: -5}}
                            anchorEl={this.state.anchorPrice}
                            open={Boolean(this.state.anchorPrice)}
                            onClose={() => this.handleClosePrice()}
                            MenuListProps={{onMouseLeave: () => this.handleClosePrice()}}
                        >
                            <div className="items-other-price">
                                <div className="items-other-price-1">
                                    <RangeSlider minPrice={this.state.minPrice}
                                                 maxPrice={this.state.maxPrice}
                                                 handleMinPrice={(value) => this.handleMinPrice(value)}
                                                 handleMaxPrice={(value) => this.handleMaxPrice(value)}/>
                                    {/*<input value={this.state.minPrice}*/}
                                    {/*       onChange={event => this.handleMinPrice(event.target.value)}*/}
                                    {/*       onKeyDown={(event) => this.handleKeyDown(event)}*/}
                                    {/*       className="price-input-in-map"*/}
                                    {/*       type="number"*/}
                                    {/*       placeholder="Min"/>*/}
                                    {/*<div className="item-price-space"> -</div>*/}
                                    {/*<input value={this.state.maxPrice}*/}
                                    {/*       onChange={event => this.handleMaxPrice(event.target.value)}*/}
                                    {/*       onKeyDown={(event) => this.handleKeyDown(event)}*/}
                                    {/*       className="price-input-in-map"*/}
                                    {/*       type="number"*/}
                                    {/*       placeholder="Max"/>*/}
                                </div>
                                <div className="items-other-price-2">
                                    Đơn vị: VND
                                </div>
                            </div>
                        </Menu>
                    </div>

                    <div className="other-select-main">
                        <div className="btn-other-select"
                             aria-owns={this.state.anchorModel ? "simple-menu" : undefined}
                             aria-haspopup="true"
                             onClick={(e) => this.handleHoverModel(e)}
                        >
                            <button className="other-select-in-map">Loại hình</button>
                            <DownOutlined className="drop-down-other-select"/>
                        </div>
                        <Menu
                            id="other-select-menu"
                            className="other-select-menu"
                            transformOrigin={{vertical: -10, horizontal: -5}}
                            anchorEl={this.state.anchorModel}
                            open={Boolean(this.state.anchorModel)}
                            onClose={() => this.handleCloseModel()}
                            MenuListProps={{onMouseLeave: () => this.handleCloseModel()}}
                        >
                            <div className="items-other-select">
                                <FormGroup className="form-group">
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={this.state.selectedTypeValues.includes('APARTMENT')}
                                            value="APARTMENT"
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: "#FFC542",
                                                },
                                            }}
                                            onChange={this.handleCheckboxTypeChange}
                                        />} label="Chung cư"/>
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={this.state.selectedTypeValues.includes('HOUSE_LAND')}
                                            value="HOUSE_LAND"
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: "#FFC542",
                                                },
                                            }}
                                            onChange={this.handleCheckboxTypeChange}
                                        />} label="Nhà nguyên căn"/>
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={this.state.selectedTypeValues.includes('BEDSIT')}
                                            value="BEDSIT"
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: "#FFC542",
                                                },
                                            }}
                                            onChange={this.handleCheckboxTypeChange}
                                        />} label="Phòng trọ"/>
                                </FormGroup>
                            </div>
                        </Menu>
                    </div>

                    <div className="other-select-main">
                        <div className="btn-other-select"
                             aria-owns={this.state.anchorNumberRoom ? "simple-menu" : undefined}
                             aria-haspopup="true"
                             onClick={(e) => this.handleHoverNumberRoom(e)}
                        >
                            <button className="other-select-in-map">Số phòng ngủ</button>
                            <DownOutlined className="drop-down-other-select"/>
                        </div>
                        <Menu
                            id="other-select-menu"
                            className="other-select-menu"
                            transformOrigin={{vertical: -10, horizontal: -5}}
                            anchorEl={this.state.anchorNumberRoom}
                            open={Boolean(this.state.anchorNumberRoom)}
                            onClose={() => this.handleCloseNumberRoom()}
                            MenuListProps={{onMouseLeave: () => this.handleCloseNumberRoom()}}
                        >
                            <div className="items-other-select">
                                <FormGroup className="form-group">
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={this.state.selectedRoomValues.includes("1")}
                                            value="1"
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: "#FFC542",
                                                },
                                            }}
                                            onChange={this.handleCheckboxRoomChange}
                                        />} label="1 phòng"/>
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={this.state.selectedRoomValues.includes("2")}
                                            value="2"
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: "#FFC542",
                                                },
                                            }}
                                            onChange={this.handleCheckboxRoomChange}
                                        />} label="2 phòng"/>
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={this.state.selectedRoomValues.includes("3")}
                                            value="3"
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: "#FFC542",
                                                },
                                            }}
                                            onChange={this.handleCheckboxRoomChange}
                                        />} label="3 phòng"/>
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={this.state.selectedRoomValues.includes("4")}
                                            value="4"
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: "#FFC542",
                                                },
                                            }}
                                            onChange={this.handleCheckboxRoomChange}
                                        />} label="4 phòng +"/>
                                </FormGroup>
                            </div>
                        </Menu>
                    </div>
                </div>
            </>
        )
    }
}
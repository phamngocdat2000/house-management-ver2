import React, {Component} from 'react';
import {Map, GoogleApiWrapper, Marker} from 'google-maps-react';
import {API_KEY} from "../../Const/ActionType";
import '../../CSS/map-style.css';
import iconLocation from '../../Image/icon-location.png';
import PopupDistance from "../Popup/PopupDistance";

class ClickChooseLocation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            lat: "",
            lng: "",
            address: "",
            distance: "",
            isPopupOpen: false
        };
    }

    handleClick = (mapProps, map, clickEvent) => {
        const lat = clickEvent.latLng.lat();
        const lng = clickEvent.latLng.lng();
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.results.length > 0) {
                    this.setState({ address: data.results[0].formatted_address });
                }
            })
            .catch(error => {
                console.log(error);
            });
        this.setState({
            lat: lat,
            lng: lng,
        })
    }

    handleConfirm = () => {
        if (window.location.pathname.includes("/choose-location")) {
            if (this.state.lat) {
                this.setState({isPopupOpen: true});
            }
        } else {
            this.props.handleOpenPopup(true, false);
            this.props.handleMapDone(this.state.lat, this.state.lng, this.state.address)
        }
    }

    handlePopupClose = () => {
        this.setState({isPopupOpen: false});
    };

    render() {
        const mapStyles = {
            width: '100%',
            height: '90%',
        };
        console.log(`Latitude: ${this.state.lat}, Longitude: ${this.state.lng}, Address: ${this.state.address}`);
        return (
            <div>
                <Map
                    google={this.props.google}
                    zoom={12}
                    style={mapStyles}
                    initialCenter={{
                        lat: 21.0285,
                        lng: 105.8542,
                    }}
                    onClick={this.handleClick}
                >
                    <Marker
                        icon={iconLocation}
                        position={{ lat: this.state.lat, lng: this.state.lng }} />
                </Map>
                <div className="btn-confirm-location">
                    <div style={{height:"90%"}}>
                    </div>
                    <div className="btn-confirm-location-1">
                        {window.location.pathname.includes("/choose-location") ?
                            <button className="home" onClick={this.handleConfirm}>Tiếp tục</button> :
                            <button className="home" onClick={this.handleConfirm}>Xác nhận</button>
                        }
                    </div>
                    <div className={this.state.isPopupOpen ? "djask-123-main" : "djask-123-main-none"}>
                        <div className="djask-123">
                            <div onClick={this.handlePopupClose} className="djask-124">x</div>
                            <PopupDistance lat={this.state.lat}
                                       lng={this.state.lng}
                                       isChooseLocation={true}
                            />
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default GoogleApiWrapper({
    apiKey: API_KEY
})(ClickChooseLocation);
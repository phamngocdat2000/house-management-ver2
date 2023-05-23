import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import {API_KEY} from "../../Const/ActionType";
import iconLocation from '../../Image/icon-location.png';

class MapInfo extends Component {
    render() {
        const { lat, lnp } = this.props.location; // Lấy toạ độ từ props


        return (
            <Map
                google={this.props.google}
                zoom={15}
                initialCenter={{ lat: lat, lng: lnp }}
                center={{ lat: lat, lng: lnp }}>
                <Marker
                    icon={iconLocation}
                    position={{ lat: lat, lng: lnp }} />
            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: API_KEY // Thay YOUR_API_KEY_HERE bằng API key của bạn
})(MapInfo);
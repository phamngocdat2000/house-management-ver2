import React, {Component} from 'react';
import {Map, GoogleApiWrapper, Marker} from 'google-maps-react';
import {API_KEY} from "../../Const/ActionType";
import '../../CSS/map-style.css';
import iconLocation from '../../Image/icon-location.png';

class ClickChooseLocation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            lat: "",
            lng: "",
            address: ""
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

    render() {
        const mapStyles = {
            width: '100%',
            height: '90%',
        };
        console.log(`Latitude: ${this.state.lat}, Longitude: ${this.state.lng}, Address: ${this.state.address   }`);
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
                        <button className="home">Xác nhận</button>
                    </div>
                </div>
            </div>

        );
    }
}

export default GoogleApiWrapper({
    apiKey: API_KEY
})(ClickChooseLocation);
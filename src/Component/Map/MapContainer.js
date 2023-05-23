import React, {Component} from 'react';
import {Map, Marker, InfoWindow, GoogleApiWrapper} from 'google-maps-react';
import '../../CSS/map.css';
import SearchMap from "./SearchMap";
import NotFoundResult from "./NotFoundResult";
import service from "../../API/Service";
import iconMaker from '../../Image/marker.png';
import ListHouse from "./ListHouse";
import iconNotFound from "../../Image/icon-not-found.svg";
import {API_KEY} from "../../Const/ActionType";

class MapContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            markers: [],
            currentLocation: {
                lat: 21.0285,
                lng: 105.8542,
            },
            keyword: "",
            distance: "",
            priceMin: "",
            priceMax: "",
            room: "",
            type: "",
            lat: "",
            lnp: "",
            address: "",
            data: {
                houses:[],
                centerPoint:{
                    lat: "",
                    lng: "",
                }
            },
            zoom: 11
        };
    }

    async componentDidMount() {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const keyword = params.get('keyword') ? `&keyword=${params.get('keyword')}` : "";
        const type = params.get('type') ? `&types=${params.get('type')}` : "";
        const lat = params.get('lat') ? `&lat=${params.get('lat')}` : "";
        const lnp = params.get('lnp') ? `&lnp=${params.get('lnp')}` : "";
        const distance = params.get('distance') ? `&distance=${params.get('distance')}` : "";
        await service.getHouse(keyword + type + lat + lnp + distance)
            .then(data => {
                this.setState({data: data});
                this.setState({markers: data.houses});
                this.setState({currentLocation: data.centerPoint})
                if (keyword && (keyword.includes("Quận") || keyword.includes("Phường"))) {
                    this.setState({zoom:14})
                }
            })
    }

    onGetHouseFilter = async () => {
        const keyword = this.state.keyword ? `&keyword=${this.state.keyword}` : "";
        const distance = this.state.distance ? `&distance=${this.state.distance}` : "";
        const priceMin = this.state.priceMin ? `&min_price=${this.state.priceMin}` : "";
        const priceMax = this.state.priceMax ? `&max_price=${this.state.priceMax}` : "";
        const type = this.state.type.toString() ? `&types=${this.state.type.toString()}` : "";
        const room = this.state.room.toString() ? `&room=${this.state.room.toString()}` : "";
        await service.getHouseFilter(type + room + keyword + distance + priceMin + priceMax)
            .then(data => {
                this.setState({data: data});
                this.setState({markers: data.houses});
                this.setState({currentLocation: data.centerPoint})
            })
    }

    isSearch = async (keyword) => {
        await this.setState({keyword: keyword});
        await this.onGetHouseFilter();
        console.log(this.state.markers)
    }

    isSetLocation = async (lat, lnp, address) => {
        await this.setState({
            lat: lat,
            lnp: lnp,
            address: address
        });
        await this.onGetHouseFilter();
        console.log(this.state.markers)
    }

    isSetDistance = async (distance) => {
        await this.setState({distance: distance});
        await this.onGetHouseFilter();
        console.log(this.state.markers)
    }

    isSetMinPrice = async (priceMin) => {
        await this.setState({priceMin: priceMin});
        await this.onGetHouseFilter();
        console.log(this.state.markers)
    }

    isSetMaxPrice = async (priceMax) => {
        await this.setState({priceMax: priceMax});
        await this.onGetHouseFilter();
        console.log(this.state.markers)
    }

    isRoom = async (room) => {
        await this.setState({room: room});
        await this.onGetHouseFilter();
        console.log(this.state.markers)
    }

    isTypes = async (type) => {
        await this.setState({type: type});
        await this.onGetHouseFilter();
        console.log(this.state.markers)
    }

    onMarkerClick = async (props, marker) => {
        await this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
            currentLocation: props.position
        });
        console.log(this.state.showingInfoWindow)
        console.log(this.state.currentLocation)
        console.log(this.state.selectedPlace)
    };

    handleMarkerClick = async (props, marker) => {
        console.log("KHANH")
        await this.setState({
            showingInfoWindow: false,
        });
    };

    displayMarkers = () => {
        return this.state.markers.map((marker, index) => {
            return (
                <Marker
                    key={index}
                    id={index}
                    image={marker.imagesUrl}
                    name={marker.title}
                    price={marker.price}
                    address={marker.address}
                    position={{
                        lat: marker.lat,
                        lng: marker.lnp,
                    }}
                    icon={iconMaker}
                    onClick={this.onMarkerClick}
                    onClose={this.handleMarkerClick}
                />
            );
        });
    };

    render() {
        console.log(this.state.data)
        console.log(this.state.markers)
        console.log(this.state.currentLocation)
        const mapStyles = {};
        return (
            <>
                <SearchMap
                    isSearch={this.isSearch}
                    isSetLocation={this.isSetLocation}
                    isSetDistance={this.isSetDistance}
                    isSetMaxPrice={this.isSetMaxPrice}
                    isSetMinPrice={this.isSetMinPrice}
                    isRoom={this.isRoom}
                    isTypes={this.isTypes}
                />
                <div className="map">
                    <div className="information-1">
                        <div className="information-2">
                            {this.state.markers.length > 0 ?
                                <div className="found-list-house">
                                    {this.state.markers.map((data, index) => (
                                        <ListHouse id={index} data={data} show={this.state.currentLocation}/>
                                    ))}
                                </div>
                                : <NotFoundResult/>
                            }
                        </div>
                    </div>
                    <div className="map-main">
                        <div className="map-info">
                            <Map
                                style={mapStyles}
                                google={this.props.google}
                                zoom={this.state.zoom}
                                initialCenter={this.state.currentLocation}
                                center={this.state.currentLocation}
                                onClick={(t, map, coord) => {
                                    const {latLng} = coord;
                                    latLng.lat();
                                    latLng.lng();
                                }}>
                                {this.displayMarkers()}
                                <InfoWindow
                                    marker={this.state.activeMarker}
                                    visible={this.state.showingInfoWindow}
                                    google="" map="">
                                    <div className="map-info-in">
                                        <image className="map-image-in" src={
                                            this.state.selectedPlace.image ? this.state.selectedPlace.image[0] : iconNotFound}/>
                                        <div className="map-in-in">
                                            <div className="map-title-in">{this.state.selectedPlace.name}</div>
                                            <div className="map-price-in">
                                                <p>Địa chỉ: {this.state.selectedPlace.address}</p>
                                            </div>
                                            <div className="map-price-in">
                                                <p>Giá tiền: {this.state.selectedPlace.price} VND</p>
                                            </div>
                                        </div>

                                    </div>
                                </InfoWindow>
                            </Map>
                        </div>
                    </div>
                </div>
            </>

        )
            ;
    }
}

export default GoogleApiWrapper({
    apiKey: API_KEY,
})(MapContainer);
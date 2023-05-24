import React, {useState} from "react";
import {Autocomplete, useLoadScript} from "@react-google-maps/api";
import '../../CSS/search-map.css'
import {API_KEY} from "../../Const/ActionType";

const placesLibrary = ["places"];

function AddressInput(props) {
    const [searchResult, setSearchResult] = useState("Result: none");

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: API_KEY,
        libraries: placesLibrary
    });

    function onLoad(autocomplete) {
        setSearchResult(autocomplete);
    }

    function onPlaceChanged() {
        if (searchResult != null) {
            const place = searchResult.getPlace();
            const name = place.name;
            const status = place.business_status;
            const formattedAddress = place.formatted_address;
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            console.log(place);
            console.log(`Name: ${name}`);
            console.log(`Business Status: ${status}`);
            console.log(`Formatted Address: ${formattedAddress}`);
            console.log(`Latitude: ${lat}`);
            console.log(`Longitude: ${lng}`);
            props.onAddressChanged(lat, lng, formattedAddress);
        } else {
            alert("Please enter text");
        }
    }

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div className="App">
            <div className="searchColumn">
                <Autocomplete
                    className="Autocomplete"
                    onPlaceChanged={onPlaceChanged}
                    onLoad={onLoad}
                    options={{componentRestrictions: {country: "vn"}, strictBounds: true}}>
                    <input
                        type="text"
                        placeholder="Chọn vị trí"
                        style={{
                            boxSizing: `border-box`,
                            width: `240px`,
                            height: `32px`,
                            padding: `4px 12px`,
                            borderRadius: `6px`,
                            border: `1px #d9d9d9 solid`,
                            fontSize: `14px`,
                            outline: `none`,
                            textOverflow: `ellipses`
                        }}
                    />
                </Autocomplete>
            </div>
        </div>
    );
}

export default AddressInput;

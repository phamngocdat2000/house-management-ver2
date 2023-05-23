import React, {Component, useEffect, useState} from "react";
import {useQuill} from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import {Button, Container} from "@mui/material";
import {Input, InputNumber} from "antd";
import service from "../../API/Service";
import {initializeApp, getApp} from "firebase/app";
import {getStorage, ref, uploadBytes} from "firebase/storage";
import "../../CSS/popup.css";
import AddressInput from "../Map/AddressInput";

class PopupDistance extends Component {
    constructor(props) {
        super(props);

        this.state = {
            distance: "",
        };
    }
    handleDistance = (event) => {
        this.setState({distance:event});
        console.log(this.state.distance)
    }

    onSubmit = () => {
        if (this.state.distance) {
            const lat = this.props.lat && `&lat=${this.props.lat}`;
            const lnp = this.props.lng && `&lnp=${this.props.lng}`;
            const distance = this.state.distance && `&distance=${this.state.distance}`;
            window.location.href = "/location?" + lat + lnp + distance;
        }
    }

    render() {
        return (
            <>
                <Container fixed>
                    <div className="div-title">
                        Vui lòng nhập bán kính:
                        <Input rootClassName="div-input-tile" value={this.state.distance}
                               onChange={event => this.handleDistance(event.target.value)}></Input>
                    </div>
                    <Button onClick={this.onSubmit} style={{width: '100%'}}>XÁC NHẬN</Button>
                </Container>
            </>
        );
    }
}

export default PopupDistance;
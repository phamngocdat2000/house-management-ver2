import React, { Component } from "react";
import Slider from "@mui/material/Slider";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";

class RangeSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: [0, 100000000]
        };
    }

    handleChange = (event, newValue) => {
        this.setState({ value: newValue });
        this.props.handleMinPrice(newValue[0]);
        this.props.handleMaxPrice(newValue[1]);
    };

    formatPrice = (price) => {
        return price.toLocaleString("en-US", { minimumFractionDigits: 0 });
    };

    handleInputChange = (index) => (event) => {
        const newValue = [...this.state.value];
        this.props.handleMinPrice(newValue[0]);
        this.props.handleMaxPrice(newValue[1]);
        newValue[index] = event.target.value === "" ? "" : Number(event.target.value.replace(/,/g, ""));
        this.setState({ value: newValue });
    };

    render() {
        const { value } = this.state;

        return (
            <div style={{ width: 300 }}>
                <Slider
                    min={0}
                    max={100000000}
                    step={5000000}
                    value={value}
                    style={{color:"#FFC542"}}
                    onChange={this.handleChange}
                    valueLabelDisplay="auto"
                />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Input
                        style={{width:140}}
                        value={this.formatPrice(value[0])}
                        onChange={this.handleInputChange(0)}
                        endAdornment={<InputAdornment position="end">VND</InputAdornment>}
                    />
                    <Input
                        style={{width:140}}
                        value={this.formatPrice(value[1])}
                        onChange={this.handleInputChange(1)}
                        endAdornment={<InputAdornment position="end">VND</InputAdornment>}
                    />
                </div>
            </div>
        );
    }
}

export default RangeSlider;

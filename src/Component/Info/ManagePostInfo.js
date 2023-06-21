import {Component} from "react";
import auth from "../../API/AuthService";
import service from "../../API/Service";
import ListHouse from "../Utils/ListHouse";
import {Container} from "@mui/material";
import "../../CSS/manage-house.css";

export default class ManagePostInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            dataDone: [],
            dataPending: [],
            idCheck: '',
            statusCheck: ''
        };
    }

    componentDidMount = async () => {
        const dataDone = [];
        const dataPending = [];
        this.setState({
            user: auth.getUserInfo()
        })
        await service.getPostByUsername(auth.getUserInfo().username).then(
            (data) => {
                if (data) {
                    data.forEach((item) => {
                        if (item.status && item.status === 1) {
                            dataDone.push(item);
                        } else {
                            dataPending.push(item);
                        }
                    });

                    this.setState({
                        dataDone: dataDone,
                        dataPending: dataPending
                    })
                }
            }
        )
    }

    setCurrentLocation = (lat, lng, id) => {
        this.setState({
            idCheck: id
        })
    }

    setStatusCheck = async (value) => {
        this.setState({
            statusCheck: value
        })
        await service.getPostByUsername(auth.getUserInfo().username).then(
            (data) => {
                if (data) {
                    const dataDone = [];
                    const dataPending = [];
                    data.forEach((item) => {
                        if (item.status && item.status === 1) {
                            dataDone.push(item);
                        } else {
                            dataPending.push(item);
                        }
                    });

                    this.setState({
                        dataDone: dataDone,
                        dataPending: dataPending
                    })
                }
            }
        )
    }

    render() {
        return (
            <>
                <div className="manage-post-info">
                    <div className="manage-house">
                        <div className="manage-house-title">
                            Bài viết mới
                        </div>
                        {this.state.dataDone && this.state.dataDone.map((data, id) => (
                            <ListHouse id={id}
                                       data={data}
                                       setClass={true}
                                       check={data.id === this.state.idCheck}
                                       setCurrentLocation={this.setCurrentLocation}
                                       manage={1}
                                       setStatusCheck={this.setStatusCheck}
                            >
                            </ListHouse>
                        ))}
                    </div>
                    <div className="manage-house">
                        <div className="manage-house-title">
                            Đã cho thuê
                        </div>
                        {this.state.dataPending && this.state.dataPending.map((data, id) => (
                            <ListHouse id={id}
                                       data={data}
                                       setClass={true}
                                       check={data.id === this.state.idCheck}
                                       setCurrentLocation={this.setCurrentLocation}
                                       manage={0}
                                       setStatusCheck={this.setStatusCheck}
                            >
                            </ListHouse>
                        ))}
                    </div>
                </div>
            </>
        )
    }
}
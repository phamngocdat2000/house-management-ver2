import {Component} from "react";
import auth from "../../API/AuthService";
import service from "../../API/Service";
import ListHouse from "../Map/ListHouse";
import {Container} from "@mui/material";
import "../../CSS/manage-house.css";

export default class ManagePostInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            data: [],
            idCheck: ''
        };
    }
    componentDidMount() {
        this.setState({
            user: auth.getUserInfo()
        })
        service.getPostByUsername(auth.getUserInfo().username).then(
            (data) => {
                console.log(data)
                this.setState({
                    data: data
                })
            }
        )
    }

    setCurrentLocation = (lat, lng, id) => {
        this.setState({
            idCheck: id
        })
    }

    render() {
        return (
            <>
                <Container fixed>
                    <div className="manage-house">
                        {this.state.data && this.state.data.map((data, id) => (
                            <ListHouse id={id}
                                       data={data}
                                       setClass={true}
                                       check={data.id === this.state.idCheck}
                                       setCurrentLocation={this.setCurrentLocation}
                            >
                            </ListHouse>
                        ))}
                    </div>
                </Container>
            </>
        )
    }
}
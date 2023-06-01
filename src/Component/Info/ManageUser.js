import {Component} from "react";
import ListUser from "./ListUser";
import {Container} from "@mui/material";

export default class ManageUser extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="manage-user">
                <Container fixed>
                    <div className="manage-user-title">
                        TÀI KHOẢN ĐANG CHỜ DUYỆT
                    </div>
                    <div className="manage-house">
                        {this.props.listUser && this.props.listUser.map((data, index) => (
                            <ListUser id={index} data={data}></ListUser>
                        ))
                        }
                    </div>
                </Container>
            </div>
        )
    }
}
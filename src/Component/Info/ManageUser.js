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
                    <div className="manage-house-main">
                        <div>
                            <div className="manage-user-title">
                                TÀI KHOẢN KHÁCH HÀNG
                            </div>
                            <div className="manage-house">
                                {this.props.listAllUser && this.props.listAllUser.map((data, index) => (
                                    <ListUser status={-1} id={index} data={data}></ListUser>
                                ))
                                }
                            </div>
                        </div>
                        <div>
                            <div className="manage-user-title">
                                TÀI KHOẢN ĐĂNG KÝ BÁN HÀNG
                            </div>
                            <div className="manage-house">
                                {this.props.listUser && this.props.listUser.map((data, index) => (
                                    <ListUser status={0} id={index} data={data}></ListUser>
                                ))
                                }
                            </div>
                        </div>
                        <div>
                            <div className="manage-user-title">
                                TÀI KHOẢN ĐÃ ĐƯỢC DUYỆT
                            </div>
                            <div className="manage-house">
                                {this.props.listAllUserActive && this.props.listAllUserActive.map((data, index) => (
                                    <ListUser status={1} id={index} data={data}></ListUser>
                                ))
                                }
                            </div>
                        </div>
                    </div>
            </div>
        )
    }
}
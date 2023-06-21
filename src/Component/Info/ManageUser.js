import {Component} from "react";
import ListUser from "../Utils/ListUser";

export default class ManageUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idCheck: '',
        }
    }

    setCurrentLocation = (lat, lng, id) => {
        this.setState({
            idCheck: id
        })
    }
    render() {
        return (
            <div className="manage-user">
                    <div className="manage-house-main">
                        <div className="manage-user-main">
                            <div className="manage-user-title">
                                TÀI KHOẢN KHÁCH HÀNG
                            </div>
                            <div className="manage-house">
                                {this.props.listAllUser && this.props.listAllUser.map((data, index) => (
                                    <ListUser
                                        status={0}
                                        check={data.id === this.state.idCheck}
                                        setCurrentLocation={this.setCurrentLocation}
                                        id={index}
                                        banAccount={this.props.banAccount}
                                        data={data}></ListUser>
                                ))
                                }
                            </div>
                        </div>
                        <div className="manage-user-main">
                            <div className="manage-user-title">
                                TÀI KHOẢN ĐÃ ĐƯỢC DUYỆT
                            </div>
                            <div className="manage-house">
                                {this.props.listAllUserActive && this.props.listAllUserActive.map((data, index) => (
                                    <ListUser
                                        status={1}
                                        id={index}
                                        banAccount={this.props.banAccount}
                                        data={data}></ListUser>
                                ))
                                }
                            </div>
                        </div>
                        <div className="manage-user-main">
                            <div className="manage-user-title">
                                TÀI KHOẢN BỊ BAN
                            </div>
                            <div className="manage-house">
                                {this.props.listAllUserInActive && this.props.listAllUserInActive.map((data, index) => (
                                    <ListUser
                                        status={-1}
                                        id={index}
                                        banAccount={this.props.banAccount}
                                        data={data}></ListUser>
                                ))
                                }
                            </div>
                        </div>
                    </div>
            </div>
        )
    }
}
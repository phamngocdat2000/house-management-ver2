import React, {Component} from "react";
import iconNotFound from "../../Image/icon-not-found.svg";
import PopupPost from "../Popup/PopupPost";
import ClickChooseLocation from "../Map/ClickChooseLocation";
import iconEnable from "../../Image/enable.svg";
import iconDisable from "../../Image/disable.svg";
import iconRating from "../../Image/icon-rating.png";
import service from "../../API/Service";

export default class ListUser extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
        this.state = {
            status: ""
        }
    }

    componentDidMount() {
        if (this.props.status === -1) {
            this.setState({status: "KHÁCH HÀNG"})
        }
        if (this.props.status === 0) {
            this.setState({status: "CHỜ DUYỆT"})
        }
        if (this.props.status === 1) {
            this.setState({status: "NGƯỜI BÁN"})
        }
    }

    banAccount = (username) => {
        service.banUserWithAdmin({
            username: username
        }).then((data) => {
            if (data) {
                this.props.banAccount()
            }
        })
    }

    render() {
        return (
            <>
                <button
                    className="comment-rating-main">
                    <div className="list-house-main">
                        <div className="list-house-img-main">
                            <img className="list-house-img-ver2"
                                 src={this.props.data.avaUrl ? this.props.data.avaUrl : iconNotFound} alt=""/>
                        </div>
                        <div className="list-user-info">
                            <div className="list-house-title">
                                {this.props.data.username}
                            </div>
                            <div className="list-house-last-update">
                                Ngày tạo: {this.props.data.createdDate}
                            </div>
                            <div className="list-house-last-update">
                                Lần cập nhật cuối cùng: {this.props.data.lastModifiedDate}
                            </div>
                            <div className="list-house-last-update">
                                Trạng thái: {this.state.status}
                            </div>
                        </div>
                    </div>
                    <div className="comment-rating">
                        <div className="rating"
                             onClick={() => window.location.href = "/user-info?username=" + this.props.data.username}>
                            Xem chi tiết
                        </div>
                        {this.props.data.verifyStatus === "PENDING" &&
                            <div className="rating"
                                 onClick={() => window.location.href = "/access?username=" + this.props.data.username}>
                                Duyệt tài khoản
                            </div>
                        }
                        {this.props.status !== -1 &&
                            <div className="rating" onClick={() => this.banAccount(this.props.data.username)}>
                                Khoá tài khoản
                            </div>
                        }
                    </div>
                </button>
            </>
        )
    }
}
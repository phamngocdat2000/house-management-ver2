import React, {Component} from "react";
import iconNotFound from "../../Image/icon-not-found.svg";

export default class ListUser extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
    }

    render() {
        let imgFace;
        // eslint-disable-next-line array-callback-return
        this.props.data.imagesUrl && this.props.data.imagesUrl.map((data) => {
            if (data.includes("%2Fface%2F")) {
                imgFace = data;
                console.log(imgFace)
            }
        })
        return (
            <>
                <button
                    onClick={() => window.location.href = "/access?username=" + this.props.data.username} className="comment-rating-main">
                    <div className="list-house-main">
                        <div className="list-house-img-main">
                            <img className="list-house-img-ver2"
                                 src={imgFace ? imgFace : iconNotFound} alt=""/>
                        </div>
                        <div className="list-house-info">
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
                                Trạng thái: {this.props.data.status}
                            </div>
                        </div>
                    </div>
                </button>
            </>
        )
    }
}
import React, {Component} from "react";
import '../../CSS/map-style.css';
import iconNotFound from '../../Image/icon-not-found.svg'
import service from "../../API/Service";
import iconRating from '../../Image/icon-rating.png';
import auth from "../../API/AuthService";
import PopupPost from "../Popup/PopupPost";
import ClickChooseLocation from "./ClickChooseLocation";

export default class ListHouse extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            comment: [],
            rating: 0,
            id: "",
            userInfo: auth.getUserInfo(),
            isPopupOpen: false, isMapOpen: false,
            lat: "", lng: "", address: ""
        };
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.data !== prevProps.data) {
            await this.setState({data: this.props.data})
            console.log(this.state.data)
            await this.getCommentRating()
        }
    }

    async componentDidMount() {
        await this.getCommentRating()
    }

    getCommentRating() {
        service.getComment(this.state.data.id)
            .then(data => {
                this.setState({comment: data})
            });
        service.getRating(this.state.data.createdBy).then(
            (data) => {
                let ratingValue = 0;
                // eslint-disable-next-line array-callback-return
                data && data.map((value) => {
                    ratingValue += value.ratingValue;
                })
                if (ratingValue !== 0) {
                    this.setState({rating: (ratingValue / data.length).toFixed(1)})
                }
                console.log((ratingValue / data.length).toFixed(1))
            }
        )
    }

    showHouseInfo = async (id) => {
        await this.props.setCurrentLocation(this.state.data.lat, this.state.data.lnp, id)
        await this.setState({id: this.state.data.id})
    }

    showHouseInfoV2 = async (id) => {
        window.location.href = "/info/house?id=" + id;
    }

    editPost = () => {
        this.setState({isPopupOpen: true});
        // window.location.href = "/info/house?id=" + id;
    }

    deletePost = async (id) => {
        await service.deletePost(id).then(
            (data) => {
                if (data.status === 200) {
                    window.location.reload();
                }
                if (data.status === 403) {
                    alert("Bạn không có quyền!");
                }
            }
        );
        // window.location.href = "/info/house?id=" + id;
    }

    handlePopupOpen = (popup, mapopen) => {
        // Cập nhật state của Header với giá trị address nhận được từ AddressInput
        this.setState({ isPopupOpen: popup });
        this.setState({ isMapOpen: mapopen});
    }

    handlePopupClose = () => {
        this.setState({isPopupOpen: false}); // Đặt giá trị state để đóng Popup
    };

    handleMapDone = (lat, lng, address) => {
        // Cập nhật state của Header với giá trị address nhận được từ AddressInput
        this.setState({
            lat: lat,
            lng: lng,
            address: address
        })
    }

    render() {
        console.log(this.state.userInfo)
        return (
            <>
                <button
                    onClick={() => this.showHouseInfo(this.state.data.id)} className="comment-rating-main">
                    <div className="list-house-main">
                        <div className="list-house-img-main">
                            <img className="list-house-img"
                                 src={this.state.data.imagesUrl ? this.state.data.imagesUrl[0] : iconNotFound} alt=""/>
                        </div>
                        <div className="list-house-info">
                            <div className="list-house-title">
                                {this.state.data.title}
                            </div>
                            <div className="list-house-address">
                                {this.state.data.address}
                            </div>
                            <div className="list-house-price">
                                {this.state.data.price} VND
                            </div>
                            <div className="list-house-last-update">
                                Ngày đăng: {this.state.data.lastModifiedDate}
                            </div>
                        </div>
                    </div>
                    <div className="comment-rating">
                        {this.props.check ?
                            <>
                                <div className="rating" onClick={() => this.showHouseInfoV2(this.state.data.id)}>
                                    Xem chi tiết
                                </div>
                                {this.state.userInfo.username === this.state.data.createdBy &&
                                    <>
                                        <div className="rating" onClick={this.editPost}>
                                            Chỉnh sửa
                                        </div>
                                        <div className={this.state.isPopupOpen ? "djask-123-main" : "djask-123-main-none"}>
                                            <div className="djask-123">
                                                <div onClick={this.handlePopupClose} className="djask-124">x</div>
                                                <PopupPost handleOpenPopup={this.handlePopupOpen}
                                                           dataEdit={this.state.data}
                                                           lat={this.state.lat}
                                                           lng={this.state.lng}
                                                           address={this.state.address}
                                                />
                                            </div>
                                        </div>
                                        <div className={this.state.isMapOpen ? "djask-123-main" : "djask-123-main-none"}>
                                            <ClickChooseLocation
                                                handleOpenPopup={this.handlePopupOpen}
                                                handleMapDone={this.handleMapDone}
                                            />
                                        </div>
                                    </>
                                }
                                {(this.state.userInfo.username === this.state.data.createdBy || this.state.userInfo.username === 'admin') &&
                                    <div className="rating" onClick={() => this.deletePost(this.state.data.id)}>
                                        Xoá
                                    </div>
                                }
                            </>
                             :
                            <>
                                <div className="rating">
                                    <img src={iconRating} alt=""/>:
                                    &nbsp;
                                    {this.state.data.createdBy}
                                    &nbsp;
                                    ({this.state.rating}/5 Đánh giá)
                                </div>
                                <div className="comment">
                                    {this.state.comment.length} Bình luận
                                </div>
                            </>
                        }
                    </div>
                </button>
            </>
        )
    }
}
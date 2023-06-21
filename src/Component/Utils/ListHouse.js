import React, {Component} from "react";
import '../../CSS/map-style.css';
import iconNotFound from '../../Image/icon-not-found.svg'
import service from "../../API/Service";
import iconRating from '../../Image/icon-rating.png';
import auth from "../../API/AuthService";
import PopupPost from "../Popup/PopupPost";
import ClickChooseLocation from "../Map/ClickChooseLocation";
import notice from "../../ActionService/Notice";
import iconEnable from "../../Image/enable.svg";
import iconDisable from "../../Image/disable.svg";

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
        console.log(id)
        window.location.href = "/info/house?id=" + id;
    }

    enablePost = async(id) => {
        let params = {
            title: this.state.data.title,
            price: this.state.data.price,
            description: this.state.data.description,
            address: this.state.data.address,
            district: this.state.data.district,
            street: this.state.data.street,
            city: "Thành phố Hà Nội",
            lat: this.state.data.lat,
            lnp: this.state.data.lnp,
            type: this.state.data.type,
            imagesUrl: this.state.data.imagesUrl,
            numberOfBedrooms: this.state.data.numberOfBedrooms,
            numberOfToilets: this.state.data.numberOfToilets,
            numberOfKitchens: this.state.data.numberOfKitchens,
            area: this.state.data.area,
            status: 1,
        }
        await service.editPost(id, params).then((data) => {
            if (data) {
                this.props.setStatusCheck(data.id + data.status)
            }
        });
    }

    disablePost = async(id) => {
        let params = {
            title: this.state.data.title,
            price: this.state.data.price,
            description: this.state.data.description,
            address: this.state.data.address,
            district: this.state.data.district,
            street: this.state.data.street,
            city: "Thành phố Hà Nội",
            lat: this.state.data.lat,
            lnp: this.state.data.lnp,
            type: this.state.data.type,
            imagesUrl: this.state.data.imagesUrl,
            numberOfBedrooms: this.state.data.numberOfBedrooms,
            numberOfToilets: this.state.data.numberOfToilets,
            numberOfKitchens: this.state.data.numberOfKitchens,
            area: this.state.data.area,
            status: 0,
        }
        await service.editPost(id, params).then((data) => {
            if (data) {
                this.props.setStatusCheck(data.id + data.status)
            }
        });
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
                    notice.err("Bạn không có quyền!");
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

    formatPrice = (price) => {
        return price.toLocaleString("en-US", { minimumFractionDigits: 0 });
    };

    render() {
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
                                {this.formatPrice(this.state.data.price)} VND
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
                                {this.state.userInfo && this.state.userInfo.username === this.state.data.createdBy &&
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
                                {this.state.userInfo && (this.state.userInfo.username === this.state.data.createdBy || this.state.userInfo.username === 'admin') &&
                                    <div className="rating" onClick={() => this.deletePost(this.state.data.id)}>
                                        Xoá
                                    </div>
                                }
                                {this.props.manage === 1 &&
                                    <div className="rating"
                                         onClick={() => this.disablePost(this.state.data.id)}>
                                        Online
                                        <span style={{marginLeft:"0.25rem"}}>
                                            <img src={iconEnable} alt="enable"/>
                                        </span>
                                    </div>
                                }
                                {this.props.manage === 0 &&
                                    <div className="rating"
                                         onClick={() => this.enablePost(this.state.data.id)}>
                                        Offline
                                        <span style={{marginLeft:"0.25rem"}}>
                                            <img src={iconDisable} alt="disable"/>
                                        </span>
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
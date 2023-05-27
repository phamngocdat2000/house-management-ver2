import {Component} from "react";
import '../../CSS/map-style.css';
import iconNotFound from '../../Image/icon-not-found.svg'
import service from "../../API/Service";
import iconRating from '../../Image/icon-rating.png';

export default class ListHouse extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            comment: [],
            rating: [],
            id: ""
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
        service.getRating(this.state.data.createdBy)
            .then(data => {
                this.setState({rating: data})
            });
    }

    showHouseInfo = async (id) => {
        await this.props.setCurrentLocation(this.state.data.lat, this.state.data.lnp, id)
        await this.setState({id: this.state.data.id})
    }

    showHouseInfoV2 = async (id) => {
        window.location.href = "/info/house?id=" + id;
    }

    render() {
        return (
            <>
                <button onClick={() => this.showHouseInfo(this.state.data.id)} className="comment-rating-main">
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
                            <div className="rating" onClick={() => this.showHouseInfoV2(this.state.data.id)}>
                                Xem chi tiết
                            </div> :
                            <>
                                <div className="rating">
                                    <img src={iconRating} alt=""/>:
                                    &nbsp;
                                    {this.state.data.createdBy}
                                    &nbsp;
                                    ({this.state.rating.length}/5 Đánh giá)
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
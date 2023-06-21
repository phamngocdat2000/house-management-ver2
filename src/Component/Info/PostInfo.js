import React, {Component} from "react";
import '../../CSS/map-style.css';
import service from "../../API/Service";
import '../../CSS/info.css';
import MapInfo from "./MapInfo";
import wc from "../../Image/wc.png";
import bedroom from "../../Image/bedroom.png";
import kitchen from "../../Image/kitchen.png";
import area from "../../Image/area.png";
import iconAccount from "../../Image/icon-account.png";
import iconHouse from "../../Image/icon-house.png";
import iconCoins from "../../Image/icon-coins.png";
import {Input} from "antd";
import ShowComment from "../Utils/ShowComment";
import SockJS from "sockjs-client";
import Stomp from 'stompjs';
import config from "../../API/Config";
import Rating from "../Utils/Rating";
import auth from "../../API/AuthService";
import ImageSlider from "../Utils/ImageSlider";

export default class PostInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            info: {
                id: null,
                title: null,
                price: null,
                description: null,
                address: null,
                district: null,
                street: null,
                city: null,
                lat: null,
                lnp: null,
                createdBy: null,
                name: null,
                createdDate: null,
                lastModifiedDate: null,
                numberOfBedrooms: null,
                numberOfToilets: null,
                numberOfKitchens: null,
                area: null,
                imagesUrl: null,
                type: null
            },
            comment: null,
            listComment: [],
            messages: [],
            user: {}
        };
    }


    async componentDidMount() {
        const socket = new SockJS(config.WS);
        const stompClient = Stomp.over(socket);
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const id = params.get('id')
        await service.getInfoPost(id)
            .then(data => {
                console.log(data)
                this.setState({info: data})
            })
        await service.getComment(id)
            .then(data => {
                console.log(data)
                this.setState({listComment: data})
            })
        stompClient.connect({}, () => {
            console.log('WebSocket connection opened');

            // Đăng ký lắng nghe sự kiện từ /post/49
            stompClient.subscribe('/post/' + id, message => {
                if (message) {
                    service.getComment(id)
                        .then(data => {
                            console.log(data)
                            this.setState({listComment: data})
                        })
                }
                console.log('Received message:', message.body);
                // Xử lý dữ liệu nhận được từ server và cập nhật trong ứng dụng của bạn
            });
        });
        console.log(this.state.info)
        await service.getUser(this.state.info.createdBy).then((data) => {
            this.setState({user: data})
        })

    }

    componentWillUnmount() {
        // Đóng kết nối WebSocket khi component bị unmount
        const {stompClient} = this.state;
        if (stompClient) {
            stompClient.disconnect();
        }
    }

    handleComment = (value) => {
        this.setState({comment: value});
    }

    handleSubmitComment = async (event) => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const id = params.get('id')
        if (event.key === 'Enter') {
            console.log(this.state.comment)
            await service.comment(this.state.info.id, {
                content: this.state.comment
            }).then(data => {
                console.log(data)
            })
            await service.getComment(id)
                .then(data => {
                    this.setState({listComment: data})
                })
            this.setState({comment: null})
        }
    }

    render() {
        return (
            <>
                <div className="post-info-image">
                    {this.state.info.imagesUrl &&
                        // <img className="image-abcd" id={id} src={data} alt=""/>
                        <ImageSlider images={this.state.info.imagesUrl}/>
                    }
                </div>
                <div className="main-abcd">
                    <div className="show-info-post">
                        <div className="show-icon-main">
                            <div>
                                <div className="show-icon">
                                    <img src={iconHouse} alt=""/>
                                    &nbsp;&nbsp;&nbsp;{this.state.info.title}
                                </div>
                                <div className="show-icon">
                                    <img src={iconCoins} alt=""/>
                                    &nbsp;&nbsp;&nbsp;Giá: {this.state.info.price} VND
                                </div>
                                <div className="show-icon">
                                    <img src={bedroom} alt=""/>
                                    &nbsp;&nbsp;&nbsp;Số giường ngủ:&nbsp;
                                    {this.state.info.numberOfBedrooms ?
                                        <>
                                            {this.state.info.numberOfBedrooms}
                                        </> :
                                        <>
                                            -
                                        </>
                                    }
                                </div>
                            </div>
                            <div>
                                <div className="show-icon">
                                    <img src={wc} alt=""/>
                                    &nbsp;&nbsp;&nbsp;Nhà vệ sinh:&nbsp;
                                    {this.state.info.numberOfToilets ?
                                        <>
                                            {this.state.info.numberOfToilets}
                                        </> :
                                        <>
                                            -
                                        </>
                                    }
                                </div>
                                <div className="show-icon">
                                    <img src={kitchen} alt=""/>
                                    &nbsp;&nbsp;&nbsp;Số bếp:&nbsp;
                                    {this.state.info.numberOfKitchens ?
                                        <>
                                            {this.state.info.numberOfKitchens}
                                        </> :
                                        <>
                                            -
                                        </>
                                    }
                                </div>
                                <div className="show-icon">
                                    <img src={area} alt=""/>
                                    &nbsp;&nbsp;&nbsp;Diện tích:&nbsp;
                                    {this.state.info.area ?
                                        <>
                                            {this.state.info.area}
                                        </> :
                                        <>
                                            -
                                        </>
                                    }
                                    m2
                                </div>
                            </div>
                        </div>
                        <div className="tongquan">
                            Tổng quan
                        </div>
                        <div className="address">
                            {this.state.info.address}
                        </div>
                        <div className="map-info-post">
                            <MapInfo location={this.state.info}/>
                        </div>
                        <div className="tongquan">
                            Thông tin chi tiết
                        </div>
                        <div className="show-info-post-chitiet"
                             dangerouslySetInnerHTML={{__html: this.state.info.description}}>
                            {/*{this.state.info.description}*/}
                        </div>
                    </div>
                    <div className="show-info-user">
                        <div className="show-info-user-2">
                            <div className="show-info-user-7">
                                Người bán
                            </div>
                            <div className="show-info-user-3">
                                <img className="show-info-user-4" src={iconAccount} alt=""/>
                                <div className="show-info-user-56">
                                    <div className="show-info-user-5">{this.state.info.createdBy}</div>
                                    <div className="show-info-user-6">{this.state.user.email}</div>
                                    <div className="show-info-user-6">{this.state.user.phone}</div>
                                </div>
                            </div>
                            <div>
                                <Rating main={this.state.info.createdBy}></Rating>
                            </div>
                        </div>

                        <div className="comment-post-info">
                            <div className="comment-title">
                                Bình luận
                            </div>
                            {auth.getUserInfo() &&
                                <div className="div-input-comment-main">
                                    <Input placeholder="Viết bình luận"
                                           rootClassName="div-input-comment" value={this.state.comment}
                                           onChange={event => this.handleComment(event.target.value)}
                                           onKeyDown={(event) => this.handleSubmitComment(event)}></Input>
                                </div>
                            }
                            <div>
                                {this.state.listComment && this.state.listComment
                                    .slice()
                                    .reverse()
                                    .map((data, index) => (
                                        <ShowComment id={index}
                                                     data={data}/>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
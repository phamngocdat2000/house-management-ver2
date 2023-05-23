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
import {Input} from "antd";

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
            listComment: {},
            messages: []
        };
    }


    async componentDidMount() {
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
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const id = params.get('id')
    }

    handleComment = (value) => {
        this.setState({comment: value});
    }

    handleSubmitComment = async (event) => {
        if (event.key === 'Enter') {
            console.log(this.state.comment)
            await service.comment(this.state.info.id, {
                content: this.state.comment
            })
                .then(data => {
                    console.log(data)
                })
        }
    }

    render() {
        console.log(this.state.message)
        return (
            <>
                <div className="post-info-image">
                    {this.state.info.imagesUrl && this.state.info.imagesUrl.map((data, id) => (
                        <img className="image-abcd" id={id} src={data} alt=""/>
                    ))}
                </div>
                <div className="main-abcd">
                    <div className="show-info-post">
                        <div className="show-info-post-title">
                            {this.state.info.title}
                        </div>
                        <div className="show-info-post-des">
                            <div className="show-info-post-price">
                                {this.state.info.price} VND
                            </div>
                            <div className="show-info-post-room">
                                <img src={bedroom} alt=""/>
                                {this.state.info.numberOfBedrooms ?
                                    <>
                                        {this.state.info.numberOfBedrooms}
                                    </> :
                                    <>
                                        -
                                    </>
                                }
                            </div>
                            <div className="show-info-post-room">
                                <img src={wc} alt=""/>
                                {this.state.info.numberOfToilets ?
                                    <>
                                        {this.state.info.numberOfToilets}
                                    </> :
                                    <>
                                        -
                                    </>
                                }
                            </div>
                            <div className="show-info-post-room">
                                <img src={kitchen} alt=""/>
                                {this.state.info.numberOfKitchens ?
                                    <>
                                        {this.state.info.numberOfKitchens}
                                    </> :
                                    <>
                                        -
                                    </>
                                }
                            </div>
                            <div className="show-info-post-room">
                                <img src={area} alt=""/>
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
                        <div className="show-info-post-chitiet">
                            {this.state.info.description}
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
                                    <div className="show-info-user-5">admin</div>
                                    <div className="show-info-user-6">0912370486</div>
                                </div>
                            </div>
                        </div>

                        <div className="comment-post-info">
                            <div className="comment-title">
                                Bình luận
                            </div>
                            <div className="div-input-comment-main">
                                <Input placeholder="Viết bình luận"
                                       rootClassName="div-input-comment" value={this.state.comment}
                                       onChange={event => this.handleComment(event.target.value)}
                                       onKeyDown={(event) => this.handleSubmitComment(event)}></Input>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
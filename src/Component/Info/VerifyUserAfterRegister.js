import React, {Component} from "react";
import {Button, Container} from "@mui/material";
import iconVerify from "../../Image/icon-verify.png";
import {getStorage, ref, uploadBytes} from "firebase/storage";
import {getApp, initializeApp} from "firebase/app";
import auth from "../../API/AuthService";
import "../../CSS/verify.css";
import service from "../../API/Service";
import notice from "../../ActionService/Notice";


export default class VerifyUserAfterRegister extends Component {
    constructor(props) {
        super(props);
        let selectedImage1
        let selectedImage2
        let selectedImage3
        if (window.location.pathname.includes("access")) {
            const search = window.location.search;
            const params = new URLSearchParams(search);
            const username = params.get('username');
            console.log(auth.getListUser())
            if (auth.getListUser()) {
                for (let i = 0; i < auth.getListUser().length; i++) {
                    if (auth.getListUser()[i].username === username) {
                        auth.getListUser()[i] && auth.getListUser()[i].imagesUrl
                        && auth.getListUser()[i].imagesUrl.length > 0
                        && auth.getListUser()[i].imagesUrl.map((data) => {
                            if (data.includes("%2Ffront%2F")) {
                                selectedImage1 = data
                            }
                            if (data.includes("%2Fback%2F")) {
                                selectedImage2 = data
                            }
                            if (data.includes("%2Fface%2F")) {
                                selectedImage3 = data
                            }
                        })
                    }
                }
            }
        }
        auth.getDataVerify() && auth.getDataVerify().imagesUrl
        && auth.getDataVerify().imagesUrl.length > 0
        && auth.getDataVerify().imagesUrl.map((data) => {
            if (data.includes("%2Ffront%2F")) {
                selectedImage1 = data
            }
            if (data.includes("%2Fback%2F")) {
                selectedImage2 = data
            }
            if (data.includes("%2Fface%2F")) {
                selectedImage3 = data
            }
        })
        this.state = {
            selectedImage1: selectedImage1 ? selectedImage1 : "",
            selectedImage2: selectedImage2 ? selectedImage2 : "",
            selectedImage3: selectedImage3 ? selectedImage3 : "",
        }
    }

    convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }

    firebaseConfig = {
        apiKey: "AIzaSyCoMsA-H7LMuMAtH5zUBq1oWPXO-JUcVzs",
        authDomain: "management-house.firebaseapp.com",
        projectId: "management-house",
        storageBucket: "management-house.appspot.com",
        messagingSenderId: "967488751398",
        appId: "1:967488751398:web:20a24f37494d5557f023e7",
        measurementId: "G-SVN9XXSHFN"
    };

    app = initializeApp(this.firebaseConfig);

    firebaseApp = getApp();

    storage = getStorage(this.firebaseApp, "gs://management-house.appspot.com");

    handleImage = async (files, type) => {
        if (files.length > 1) {
            notice.inf("Chỉ được chọn 1 ảnh");
            return;
        }
        console.log(files);
        let fileNames = "";
        if (type === 1 && this.state.selectedImage1.length > 0) {
            fileNames = this.state.selectedImage1;
        }
        if (type === 2 && this.state.selectedImage2.length > 0) {
            fileNames = this.state.selectedImage2;
        }
        if (type === 3 && this.state.selectedImage3.length > 0) {
            fileNames = this.state.selectedImage3;
        }
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith('image/')) {
                notice.inf('Chỉ chấp nhận tệp ảnh');
                return;
            }
            // eslint-disable-next-line no-unused-vars
            let base64
            this.convertBase64(file).then((value) => {
                base64 = value;
            }).catch((error) => {
                console.log(error)
            })
            let storageRef;
            if (type === 1) {
                console.log("vào 1")
                storageRef = ref(this.storage, "image-ver2/" + auth.getUserInfo().username + "/front/" + file.name);
            }
            if (type === 2) {
                storageRef = ref(this.storage, "image-ver2/" + auth.getUserInfo().username + "/back/" + file.name);
            }
            if (type === 3) {
                storageRef = ref(this.storage, "image-ver2/" + auth.getUserInfo().username + "/face/" + file.name);
            }
            const metadata = {
                contentType: 'image/jpeg',
            };

            await uploadBytes(storageRef, file, metadata).then(() => {
                console.log('Uploaded image');
            });

            if (type === 1) {
                console.log("vào 1")
                fileNames = ("https://firebasestorage.googleapis.com/v0/b/management-house.appspot.com/o/image-ver2%2F" + auth.getUserInfo().username + "%2Ffront%2F" + file.name + "?alt=media");
                this.setState({
                    selectedImage1: fileNames
                });
            }

            if (type === 2) {
                fileNames = ("https://firebasestorage.googleapis.com/v0/b/management-house.appspot.com/o/image-ver2%2F" + auth.getUserInfo().username + "%2Fback%2F" + file.name + "?alt=media");
                this.setState({
                    selectedImage2: fileNames
                });
            }

            if (type === 3) {
                fileNames = ("https://firebasestorage.googleapis.com/v0/b/management-house.appspot.com/o/image-ver2%2F" + auth.getUserInfo().username + "%2Fface%2F" + file.name + "?alt=media");
                this.setState({
                    selectedImage3: fileNames
                });
            }
        }
    }

    displayImages = (selectedImage, type) => {
        return (
            <div className="handleimage">
                <img
                    alt="img-show"
                    className="img-show"
                    src={selectedImage}
                />
                <br/>
                <Button style={{fontWeight: 'Bold'}}
                        onClick={() => this.handleDeleteImage(selectedImage, type)}>x</Button>
            </div>
        )
    }

    handleDeleteImage = (imageName, type) => {
        if (type === 1) {
            this.setState({
                selectedImage1: ""
            })
        }
        if (type === 2) {
            this.setState({
                selectedImage2: ""
            })
        }
        if (type === 3) {
            this.setState({
                selectedImage3: ""
            })
        }

    };

    confirm = () => {
        if (!window.location.pathname.includes("/access")
            && (!this.state.selectedImage1.length > 0 || !this.state.selectedImage2.length > 0 || !this.state.selectedImage3.length > 0)) {
            notice.err("Vui lòng tải lên đủ 3 ảnh")
            return;
        }
        if (window.location.pathname.includes("/verify-update")) {
            service.updateVerifyUser({
                imagesUrl: [
                    this.state.selectedImage1,
                    this.state.selectedImage2,
                    this.state.selectedImage3
                ],
                description: "Nhờ admin xác thực tài khoản"
            }).then((data) => {
                if (data.status && data.status === "PENDING") {
                    notice.success("Vui lòng đợi trong vòng 24h để admin kiểm định");
                    window.location.href = "/"
                }
            }).catch((error) => notice.err(error)
            )
        } else if (window.location.pathname.includes("/verify")){
            service.createVerifyUser({
                imagesUrl: [
                    this.state.selectedImage1,
                    this.state.selectedImage2,
                    this.state.selectedImage3
                ],
                description: "Nhờ admin xác thực tài khoản"
            }).then((data) => {
                if (data.status && data.status === "PENDING") {
                    notice.success("Vui lòng đợi trong vòng 24h để admin kiểm định");
                    window.location.href = "/"
                }
            }).catch((error) => notice.err(error)
            )
        } else if (window.location.pathname.includes("/access")) {
            const search = window.location.search;
            const params = new URLSearchParams(search);
            const username = params.get('username');
            service.acceptVerify(username, null).then((data) => {
                if (data.status === 200) {
                    console.log(data)
                    notice.success("User: " + username + " đã được cập nhật trạng thái")
                    window.history.back();
                } else {
                    notice.err("Có lỗi xảy ra, vui lòng liên hệ IT để hỗ trợ")
                    console.log(data)
                }
            }).catch((error) => notice.err(error)
            )
        }
    }

    render() {
        return (
            <> {(auth.getVerify() && !auth.getVerify().isVerified) || window.location.pathname.includes("access") ?
                <div className="content">
                    <Container maxWidth="sm" className='container-login'>
                        <div className='form form-ver2'>
                            <img src={iconVerify} alt="icon login"/>
                            <div className="img-verify">
                                <div className="CCCD">
                                    <div className="title-verify">
                                        CCCD/CMND:
                                    </div>
                                    <div className="img-verify-cccd">
                                        <div className="front">
                                            <div className="akjsd">
                                                Mặt trước:
                                            </div>
                                            <div className="front-back">
                                                {!this.state.selectedImage1.length > 0 &&
                                                    <input
                                                        type="file"
                                                        name="myImage"
                                                        multiple
                                                        onChange={(event) => {
                                                            this.handleImage(event.target.files, 1);
                                                        }}
                                                    />
                                                }
                                                <div>
                                                    {(this.state.selectedImage1.length > 0) && this.displayImages(this.state.selectedImage1, 1)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="back">
                                            <div className="akjsd">
                                                Mặt sau:
                                            </div>
                                            <div className="front-back">
                                                {!this.state.selectedImage2.length &&
                                                    <input
                                                        type="file"
                                                        name="myImage"
                                                        multiple
                                                        onChange={(event) => {
                                                            this.handleImage(event.target.files, 2);
                                                        }}
                                                    />
                                                }
                                                <div>
                                                    {(this.state.selectedImage2.length > 0) && this.displayImages(this.state.selectedImage2, 2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="face-id">
                                    <div className="title-verify">
                                        Ảnh nhận diện gương mặt:
                                    </div>
                                    <div className="img-verify-cccd">
                                        <div className="face">
                                            <div className="front-back">
                                                {!this.state.selectedImage3.length &&
                                                    <input
                                                        type="file"
                                                        name="myImage"
                                                        multiple
                                                        onChange={(event) => {
                                                            this.handleImage(event.target.files, 3);
                                                        }}
                                                    />
                                                }
                                                <div>
                                                    {(this.state.selectedImage3.length > 0) && this.displayImages(this.state.selectedImage3, 3)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={this.confirm}
                                className='btn-login-123-ver1'
                            >
                                Xác nhận</Button>
                            <Button onClick={() => window.history.back()}
                                    className='btn-login-123'
                            >
                                Có lẽ để sau</Button>
                        </div>
                    </Container>
                </div> :
                <div className="content">
                    <Container maxWidth="sm" className='container-login'>
                        <div className='form form-ver2'>
                            <div>
                                <Button
                                    onClick={this.confirm}
                                    className='btn-login-123-ver2'
                                >
                                    Tài khoản của bạn đã được kích hoạt
                                    <img src={iconVerify} alt="icon login"/>
                                </Button>
                            </div>
                            <Button onClick={() => window.history.back()}
                                    className='btn-login-123-ver3'
                            >
                                Quay lại</Button>
                        </div>
                    </Container>
                </div>
            }
            </>
        )
    }
}
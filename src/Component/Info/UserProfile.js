import React, {useEffect, useState} from 'react';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBTypography,
    MDBInput, MDBFile
} from 'mdb-react-ui-kit';
import '../../CSS/user.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import iconVerify from "../../Image/check-circle.svg";
import iconEdit from "../../Image/edit.svg";
import iconNotFound from "../../Image/icon-not-found.svg";
import iconConfirm from "../../Image/confirm.svg";
import iconBack from "../../Image/back.svg";
import service from "../../API/Service";
import notice from "../../ActionService/Notice";
import {getStorage, ref, uploadBytes} from "firebase/storage";
import auth from "../../API/AuthService";
import {getApp, initializeApp} from "firebase/app";

export default function UserProfile(props) {
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [avaUrl, setAvaUrl] = useState("");
    const [edit, setEdit] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const firebaseConfig = {
        apiKey: "AIzaSyCoMsA-H7LMuMAtH5zUBq1oWPXO-JUcVzs",
        authDomain: "management-house.firebaseapp.com",
        projectId: "management-house",
        storageBucket: "management-house.appspot.com",
        messagingSenderId: "967488751398",
        appId: "1:967488751398:web:20a24f37494d5557f023e7",
        measurementId: "G-SVN9XXSHFN"
    };
    const app = initializeApp(firebaseConfig);
    const firebaseApp = getApp();
    const storage = getStorage(firebaseApp, "gs://management-house.appspot.com");

    useEffect(() => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const username = params.get('username')
        if (username) {
            if (props.listUser) {
                props.listUser.forEach((item) => {
                    if (item.username && item.username === username) {
                        setPhone(item.phone)
                        setEmail(item.email)
                        setFullName(item.fullName)
                        setAvaUrl(item.avaUrl)
                        setIsVerified(item.isVerified)
                    }
                });
            }
        } else {
            setPhone(props.user.phone)
            setEmail(props.user.email)
            setFullName(props.user.fullName)
            setAvaUrl(props.user.avaUrl)
            setIsVerified(props.user.isVerified)
        }
    },[props.user, props.listUser])

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handlePhone = (e) => {
        setPhone(e.target.value)
    }

    const handleFullName = (e) => {
        setFullName(e.target.value)
    }

    const handleEdit = (value) => {
        setEdit(value)
    }

    const rollBack = () => {
        window.history.back();
    }

    const handleSubmit = async () => {
        await service.editUser({
            fullName: fullName,
            email: email,
            phone: phone,
            avaUrl: avaUrl
        }).then((data) => {
            if (data.username) {
                notice.success("Chỉnh sửa thành công")
                setEdit(false)
            }
        }).catch((err) => {
            notice.err(err)
        })
    }

    const convertBase64 = (file) => {
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

    const handleImage = async (files) => {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith('image/')) {
                notice.inf('Chỉ chấp nhận tệp ảnh');
                return;
            }
            // eslint-disable-next-line no-unused-vars
            let base64
            convertBase64(file).then((value) => {
                base64 = value;
            }).catch((error) => {
                console.log(error)
            })
            const storageRef = ref(storage, "image-ver2/" + auth.getUserInfo().username + "/profile/" + file.name);
            const metadata = {
                contentType: 'image/jpeg',
            };
            await uploadBytes(storageRef, file, metadata).then(() => {
                console.log('Uploaded image');
            });
            setAvaUrl("https://firebasestorage.googleapis.com/v0/b/management-house.appspot.com/o/image-ver2%2F" + auth.getUserInfo().username + "%2Fprofile%2F" + file.name + "?alt=media");
        }
    }

    return (
        <>
            {edit ?
                <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
                    <MDBContainer className="py-5 h-100">
                        <MDBRow className="justify-content-center align-items-center h-100">
                            <MDBCol lg="6" className="mb-4 mb-lg-0">
                                <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                                    <MDBRow className="g-0">
                                        <MDBCol md="4" className="gradient-custom text-center text-white"
                                                style={{ borderTopLeftRadius: '.5rem'}}>
                                            <MDBCardImage src={avaUrl ? avaUrl : iconNotFound}
                                                          type="file"
                                                          alt="Avatar" className="my-5" style={{ width: '80px' }} fluid />
                                            <input
                                                id="files"
                                                type="file"
                                                name="myImage"
                                                className="image-user-profile-none"
                                                multiple
                                                onChange={(event) => {
                                                    handleImage(event.target.files);
                                                }}
                                            />
                                            <MDBTypography tag="h6">
                                                <label className="label-image" htmlFor="files">Cập nhật ảnh đại diện</label>
                                            </MDBTypography>
                                            <MDBInput value={fullName}
                                                      onChange={handleFullName}
                                                      className="check-check"></MDBInput>
                                            <img onClick={handleSubmit}
                                                 className="icon-edit-ver2 icon-edit-ver3"
                                                 style={{cursor:"pointer"}}
                                                 src={iconConfirm} alt="Chỉnh sửa"/>
                                        </MDBCol>
                                        <MDBCol md="8">
                                            <MDBCardBody className="p-4">
                                                <MDBTypography tag="h6">
                                                    Thông tin
                                                </MDBTypography>
                                                <hr className="mt-0 mb-4" />
                                                <MDBRow className="pt-1">
                                                    <MDBCol size="6" className="mb-3">
                                                        <MDBTypography tag="h6">Email</MDBTypography>
                                                        <MDBInput value={email}
                                                                  onChange={handleEmail}
                                                                  className="text-muted"></MDBInput>
                                                    </MDBCol>
                                                    <MDBCol size="6" className="mb-3">
                                                        <MDBTypography tag="h6">Số điện thoại</MDBTypography>
                                                        <MDBInput value={phone}
                                                                  onChange={handlePhone}
                                                                  className="text-muted"></MDBInput>
                                                    </MDBCol>
                                                </MDBRow>
                                                <hr className="mt-0 mb-4" />
                                                <div className="MDBCardText">
                                                    {isVerified &&
                                                        <>
                                                            <MDBCardText>
                                                                Tài khoản đã được xác thực
                                                                <img style={{marginLeft: "0.25rem"}}
                                                                     src={iconVerify} alt="Tài khoản xác thực"/>
                                                            </MDBCardText>
                                                        </>
                                                    }
                                                </div>
                                            </MDBCardBody>
                                        </MDBCol>
                                        <MDBCol md="4" className="gradient-custom text-center text-white"
                                                style={{borderBottomLeftRadius: '.5rem' }}>
                                            <div onClick={rollBack}
                                                 className="roll-back">Quay lại</div>
                                        </MDBCol>
                                    </MDBRow>
                                </MDBCard>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </section> :
                <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
                    <MDBContainer className="py-5 h-100">
                        <MDBRow className="justify-content-center align-items-center h-100">
                            <MDBCol lg="6" className="mb-4 mb-lg-0">
                                <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                                    <MDBRow className="g-0">
                                        <MDBCol md="4" className="gradient-custom text-center text-white"
                                                style={{ borderTopLeftRadius: '.5rem'}}>
                                            <MDBCardImage src={avaUrl ? avaUrl : iconNotFound}
                                                          alt="Avatar" className="my-5" style={{ width: '80px' }} fluid />
                                            <MDBTypography tag="h5">{fullName}</MDBTypography>
                                            <img onClick={() => handleEdit(true)}
                                                 className="icon-edit-ver2"
                                                 style={{marginTop:"-1rem",cursor:"pointer"}}
                                                 src={iconEdit} alt="Chỉnh sửa"/>
                                        </MDBCol>
                                        <MDBCol md="8">
                                            <MDBCardBody className="p-4">
                                                <MDBTypography tag="h6">Thông tin</MDBTypography>
                                                <hr className="mt-0 mb-4" />
                                                <MDBRow className="pt-1">
                                                    <MDBCol size="6" className="mb-3">
                                                        <MDBTypography tag="h6">Email</MDBTypography>
                                                        <MDBCardText className="text-muted">{email}</MDBCardText>
                                                    </MDBCol>
                                                    <MDBCol size="6" className="mb-3">
                                                        <MDBTypography tag="h6">Số điện thoại</MDBTypography>
                                                        <MDBCardText className="text-muted">{phone}</MDBCardText>
                                                    </MDBCol>
                                                </MDBRow>
                                                <hr className="mt-0 mb-4" />
                                                <div className="MDBCardText">
                                                    {isVerified &&
                                                        <>
                                                            <MDBCardText>
                                                                Tài khoản đã được xác thực
                                                                <img style={{marginLeft: "0.25rem"}}
                                                                     src={iconVerify} alt="Tài khoản xác thực"/>
                                                            </MDBCardText>
                                                        </>
                                                    }
                                                </div>
                                            </MDBCardBody>
                                        </MDBCol>
                                        <MDBCol md="4" className="gradient-custom text-center text-white"
                                                style={{borderBottomLeftRadius: '.5rem' }}>
                                           <div onClick={rollBack}
                                                className="roll-back">Quay lại</div>
                                        </MDBCol>
                                    </MDBRow>
                                </MDBCard>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </section>
            }
        </>


    );
}

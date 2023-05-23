import React, {useEffect, useState} from "react";
import {useQuill} from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import {Button, Container} from "@mui/material";
import {Input, InputNumber} from "antd";
import service from "../../API/Service";
import {initializeApp, getApp} from "firebase/app";
import {getStorage, ref, uploadBytes} from "firebase/storage";
import "../../CSS/popup.css";
import AddressInput from "../Map/AddressInput";

function HtmlEditor(props) {
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

    const {quill, quillRef} = useQuill();

    const [value, setValue] = useState();

    const [title, setTitle] = useState();

    const [price, setPrice] = useState();

    const [selectedImage, setSelectedImage] = useState([]);

    const [typeSearch, setTypeSearch] = useState("APARTMENT");

    const [latitude, setLatitude] = useState(null);

    const [longitude, setLongitude] = useState(null);

    const [address, setAddress] = useState(null)

    const [listDistrict, setListDistrict] = useState([]);

    const [district, setLDistrict] = useState("Quận Ba Đình");

    const [listStreet, setListStreet] = useState([]);

    const [street, setStreet] = useState("Phường Phúc Xá");

    const [bedroom, setBedroom] = useState();

    const [kitchen, setKitchen] = useState();

    const [toilet, setToilet] = useState();

    const [area, setArea] = useState();

    const [input, setInput] = useState(1);

    const [choose, setChoose] = useState(0);

    React.useEffect(() => {
        if (quill) {
            if (props.objectPost !== undefined) {
                const html = props.objectPost.html;
                const delta = quill.clipboard.convert(html);
                quill.setContents(delta);
                setValue(quillRef.current.firstChild.innerHTML);
            }
            quill.on('text-change', () => {
                console.log(quillRef.current.firstChild.innerHTML);
                setValue(quillRef.current.firstChild.innerHTML)
            });
        }
        service.getDistrict()
            .then(data => setListDistrict(data));


    }, [props.objectPost, quill, quillRef]);

    useEffect(() => {
        service.getStreet(district)
            .then(data => setListStreet(data));
    }, [district]);

    function handleAddressInputChanged(lat, lng, address) {
        setLatitude(lat);
        setLongitude(lng);
        setAddress(address)
    }

    const handleSelectDistrict = (event) => {
        setLDistrict(event.target.value);
    }

    const handleSelectStreet = (event) => {
        setStreet(event.target.value);
    }

    const openMap = () => {
        props.handleOpenPopup(false, true)
    }

    const handleMapDone = (lat, lng, address) => {
        // Cập nhật state của Header với giá trị address nhận được từ AddressInput
        setLatitude(lat)
        setLongitude(lng)
        setAddress(address)
    }

    const handleInput = (value, check) => {
        switch (check) {
            case "price":
                setPrice(value);
                break;
            case "bedroom":
                setBedroom(value);
                break;
            case "toilet":
                setToilet(value);
                break;
            case "kitchen":
                setKitchen(value)
                break;
            case "area":
                setArea(value);
            default:
                break;
        }
    }

    const handleTitle = (event) => {
        setTitle(event);
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
        const fileNames = [];
        if (selectedImage.length > 0) {
            // eslint-disable-next-line array-callback-return
            selectedImage.map((data) => {
                fileNames.push(data)
            })
        }
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // eslint-disable-next-line no-unused-vars
            let base64
            convertBase64(file).then((value) => {
                base64 = value;
            }).catch((error) => {
                console.log(error)
            })
            const storageRef = ref(storage, "image/" + file.name);
            const metadata = {
                contentType: 'image/jpeg',
            };
            await uploadBytes(storageRef, file, metadata).then(() => {
                console.log('Uploaded image');
            });
            fileNames.push("https://firebasestorage.googleapis.com/v0/b/management-house.appspot.com/o/image%2F" + file.name + "?alt=media");
        }
        setSelectedImage(fileNames);
    }

    const handleDeleteImage = (imageName) => {
        const updatedImages = selectedImage.filter(image => image !== imageName);
        setSelectedImage(updatedImages);
    };

    const onSubmit = async () => {
        try {
            let result

            result = await service.postContent({
                title: title,
                price: price,
                description: value,
                address: choose % 2 === 0 ? props.address : address,
                district: district,
                street: street,
                city: "Thành phố Hà Nội",
                lat: choose % 2 === 0 ? props.lat : latitude,
                lnp: choose % 2 === 0 ? props.lng : longitude,
                type: typeSearch,
                imagesUrl: selectedImage,
                numberOfBedrooms: bedroom,
                numberOfToilets: toilet,
                numberOfKitchens: kitchen,
                area: area
            }).then();
            console.log(result)
            alert("Success!")
            window.location.reload();
        } catch (error) {
            alert(error)
        }

    }

    const handleTypeSearch = (event) => {
        setTypeSearch(event.target.value);
    }

    const displayImages = (selectedImage) => {
        return selectedImage.map((data) => {
            return (
                <div className="handleimage">
                    <img
                        alt="not found"
                        width={"250px"}
                        src={data}
                    />
                    <br/>
                    <Button style={{fontWeight: 'Bold'}} onClick={() => handleDeleteImage(data)}>x</Button>
                </div>
            );
        });
    }

    const handleChooseAreaOrLocation = (type) => {
        if (type === "input") {
            setInput(2);
            setChoose(1);
        } else {
            setChoose(2);
            setInput(1);
        }
    }

    return (
        <>
            <Container fixed>
                <div className="div-title">
                    Tiêu đề: <Input rootClassName="div-input-tile" value={title}
                                    onChange={event => handleTitle(event.target.value)}></Input>
                </div>
                <div className="div-price">
                    Giá tiền:
                    <div className="div-input-price-1">
                        <InputNumber value={price} type="number" className="div-input-price-2"
                                     onChange={value => handleInput(value, "price")}></InputNumber>
                        VND
                    </div>
                </div>
                <div className="div-price">
                    Diện tích:
                    <div className="div-input-price-1">
                        <InputNumber value={area} type="number" className="div-input-price-2"
                                     onChange={value => handleInput(value, "area")}></InputNumber>
                        m2
                    </div>
                </div>
                <div className="div-location">
                    <div className="div-location-1">
                        Vị trí:
                        <div className="background-btn-choose">
                            <button onClick={() => handleChooseAreaOrLocation("input")}
                                    className={input % 2 === 0 ? "choose-input-or-choose-2" : "choose-input-or-choose"}>
                                Nhập vị trí
                            </button>
                            <button onClick={() => handleChooseAreaOrLocation("choose")}
                                    className={choose % 2 === 0 ? "choose-input-or-choose-2" : "choose-input-or-choose"}>
                                Chọn trên bản đồ
                            </button>
                        </div>
                    </div>
                    <div className="div-select-type-main">
                        <div className="div-type">
                            Quận/Huyện:
                            <select className="div-select-type" onChange={handleSelectDistrict}>
                                {listDistrict.map(district => (
                                    <option key={district.id} value={district}>
                                        {district}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="div-type">
                            Phường/Xã:
                            <select className="div-select-type" onChange={handleSelectStreet}>
                                {listStreet.map(street => (
                                    <option key={street.id} value={street}>
                                        {street}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {input % 2 === 0 &&
                            <div className="div-type">
                                Nhập vị trí:
                                <AddressInput onAddressChanged={handleAddressInputChanged}/>
                            </div>
                        }
                        {choose % 2 === 0 &&
                            <div className="btn-type-0">
                                <button className="btn-type" onClick={openMap}>
                                    {props.lat ? props.address : "Mở bản đồ"}
                                </button>
                            </div>}
                    </div>
                </div>
                <div className="div-type-1">
                    Kiểu cho thuê:
                    <select className="div-select-type" value={typeSearch} onChange={handleTypeSearch}>
                        <option value="APARTMENT">Chung cư</option>
                        <option value="HOUSE_LAND">Nhà nguyên căn</option>
                        <option value="BEDSIT">Phòng trọ</option>
                    </select>
                </div>
                <div className="div-location">
                    Số phòng:
                    <div className="div-select-type-main">
                        <div className="div-type">
                            Ngủ:
                            <div className="div-input-price-1">
                                <InputNumber value={bedroom} type="number" className="div-input-room-2"
                                             onChange={value => handleInput(value, "bedroom")}></InputNumber>
                            </div>
                        </div>
                        <div className="div-type">
                            Vệ sinh:
                            <div className="div-input-price-1">
                                <InputNumber value={toilet} type="number" className="div-input-room-2"
                                             onChange={value => handleInput(value, "toilet")}></InputNumber>
                            </div>
                        </div>
                        <div className="div-type">
                            Bếp:
                            <div className="div-input-price-1">
                                <InputNumber value={kitchen} type="number" className="div-input-room-2"
                                             onChange={value => handleInput(value, "kitchen")}></InputNumber>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="div-image">
                    <div>
                        Ảnh mô tả: <input
                        type="file"
                        name="myImage"
                        multiple
                        onChange={(event) => {
                            handleImage(event.target.files);
                        }}
                    />
                    </div>
                    <div>
                        {(selectedImage.length > 0) && displayImages(selectedImage)}
                    </div>

                </div>
            </Container>
            <Container fixed>
                <div ref={quillRef}/>
                <Button onClick={onSubmit} style={{width: '100%'}}>DONE</Button>
            </Container>
        </>
    );
}

export default HtmlEditor;
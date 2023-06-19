import {Component} from "react";
import footer from "../../Image/footer.svg"
import {Container} from "@mui/material";
import icon from "../../Image/favicon.ico";
import "../../CSS/footer.css"
import { Link } from 'react-scroll';

export class Footer extends Component {
    componentDidMount() {
    }

    render() {
        return (
            <>
                <div>
                    <Container fixed>
                        <div id="footer" className="footer-main">
                            <div className="footer-abc">
                                <div className="main-footer">
                                    <img className="img-footer" src={icon} alt="icon"/>
                                    <div>NESTAWAY</div>
                                </div>
                                <p>
                                    ĐẠI HỌC BÁCH KHOA HÀ NỘI
                                </p>
                                <p>
                                    Địa chỉ: Sô 1 Đại Cồ Việt, P. Bách Khoa, Q. Hai Bà Trưng, Hà Nội
                                </p>
                                <p>
                                    Email: managermenthouse@gmail.com
                                </p>
                                <p>
                                    Hotline: 0366260962
                                </p>
                            </div>
                            <div className="footer-abc">
                                <div className="main-footer">
                                    Về NESTAWAY
                                </div>
                                <div className="footer-abc2">
                                    <Link className="footer-click"
                                          spy={true}
                                          smooth={true}
                                          offset={-70}
                                          duration={500}
                                          to="main-header">Trang chủ</Link>
                                    <Link className="footer-click"
                                          spy={true}
                                          smooth={true}
                                          offset={-70}
                                          duration={500}
                                          to="main-header">Thông tin</Link>
                                </div>
                            </div>
                            <div className="footer-abc">
                                <div className="main-footer">
                                    Chức năng
                                </div>
                                <div className="footer-abc2">
                                    <Link className="footer-click"
                                          spy={true}
                                          smooth={true}
                                          offset={-70}
                                          duration={500}
                                          to="body-text2">Tìm kiếm</Link>
                                    <div className="footer-click" ref={"/location?keyword=Thành%20phố%20Hà%20Nội&"}>Khu vực Hà Nội</div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
                <div style={{width: "100%", marginTop: "5rem"}}>
                    <img style={{width: "100%"}} src={footer} alt=""/>
                </div>
            </>
        )
    }
}
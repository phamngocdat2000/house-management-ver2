import {Component} from "react";
import '../../CSS/map-style.css';
import iconNotFound from '../../Image/icon-not-found.svg'
export default class NotFoundResult extends Component {
    render() {
        return (
            <>
                <div className="not-found-result">
                    <img style={{width: "10rem", height: "auto"}} src={iconNotFound}/>
                    <p>Rất tiếc, chúng tôi không tìm thấy kết quả phù hợp.</p>
                    <p>Hãy thử điều kiện lọc khác và bắt đầu lại.</p>
                </div>
            </>
        )
    }
}
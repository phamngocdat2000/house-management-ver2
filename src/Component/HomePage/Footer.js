import {Component} from "react";
import footer from "../../Image/footer.svg"

export class Footer extends Component {
    componentDidMount() {
    }
    render() {
        return (
            <div style={{width:"100%", marginTop: "10rem"}}>
                <img style={{width:"100%"}} src={footer} alt=""/>
            </div>
        )
    }
}
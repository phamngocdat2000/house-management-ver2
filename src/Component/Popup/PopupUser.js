import React, {Component} from "react";

export default class PopupUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount() {
    }

    render() {
        return (
            <>
                <div className="main-users">
                    <div className="list-users">

                    </div>
                    <div className="service">
                        <div className="information">

                        </div>
                        <div className="update">

                        </div>
                    </div>
                </div>
            </>
        )
    }
}
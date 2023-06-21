import React from "react";
import '../../CSS/search-map.css'
import auth from "../../API/AuthService";
import iconAccount from "../../Image/icon-account.png";


function ShowComment(props) {

    console.log(props)
    return (
        <div className="show-comment-main">
            {auth.getUserInfo() && props.data.createdByInfo.fullName === auth.getUserInfo().fullName ?
                <div className="class-is-main">
                    <img className="show-comment-user-4" src={iconAccount} alt=""/>
                    <div className="show-info-user-comment-1">
                        <div className="show-fullname-1">
                            {props.data.createdByInfo.fullName} (Bạn)
                        </div>
                        <div>
                            {props.data.content}
                        </div>
                    </div>
                </div> :
                <div className="class-not-is-main">
                    <div className="show-info-user-comment-2">
                        <div className="show-fullname-2">
                            {props.data.createdByInfo.fullName}
                        </div>
                        <div>
                            {props.data.content}
                        </div>
                    </div>
                    <img className="show-comment-user-4" src={iconAccount} alt=""/>
                </div>
            }
            <div className="check-underline">
                <div className="check-underline-2"></div>
            </div>
        </div>
    );
}

export default ShowComment;

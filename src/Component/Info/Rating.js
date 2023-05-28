import React, {useEffect, useState} from 'react';
import auth from "../../API/AuthService";
import service from "../../API/Service";

const StarRating = (props) => {
    const [ratingMain, setRatingMain] = useState(0);
    const [ratingUser, setRatingUser] = useState(0);
    const [user, setUser] = useState();
    const [main, setMain] = useState();
    const [id, setId] = useState();


    const handleClick = async (value) => {
        if (props.main && props.main === user) {
            alert("Bạn không thể tự đánh giá bản thân!")
        }
        let idConst;
        await service.rating(main, {
            "ratingValue": value,
            "ratingContent": "user " + user + " đánh giá: " + value + " sao"
        }).then((data) => {
            console.log(data.code)
        }).catch((data) => {
            if (data === "Rating already exist!") {
                service.getRating(props.main).then(
                    (data) => {
                        data && data.map((value) => {
                            console.log(value.username)
                            if (value.createdByInfo && value.createdByInfo.username === user) {
                                idConst = value.id;
                                setId(value.id)
                            }
                        })
                    }
                )
                service.updateRating(idConst, {
                    "ratingValue": value,
                    "ratingContent": "user " + user + " đánh giá: " + value + " sao"
                }).then((data) => {
                    console.log(data)
                })
            }
        })
        setRatingUser(value);
    };

    useEffect(() => {
        let ratingValue = 0;
        setUser(auth.getUserInfo().username)
        if (props.main) {
            setMain(props.main);
            service.getRating(props.main).then(
                (data) => {
                    data && data.map((value) => {
                        ratingValue += value.ratingValue;
                        if (value.createdByInfo && value.createdByInfo.username === user) {
                            setRatingUser(value.ratingValue)
                        }
                    })
                    if (ratingValue !== 0) {
                        setRatingMain((ratingValue/data.length).toFixed(1))
                    }
                }
            )
        }

    }, [props.main]);

    return (
        <div className="rating-post-info">
            <p style={{marginRight:"1rem"}}>Rating: {ratingMain}/5</p>(
            {[1, 2, 3, 4, 5].map((value) => (
                <span className="rating-start"
                    key={value}
                    onClick={() => handleClick(value)}
                    style={{cursor: 'pointer'}}
                >
          {value <= ratingUser ? '★' : '☆'}
        </span>
            ))}
            )</div>
    );
};

export default StarRating;
import React, {useEffect, useState} from 'react';
import auth from "../../API/AuthService";
import service from "../../API/Service";
import notice from "../../ActionService/Notice";

const StarRating = (props) => {
    const [ratingMain, setRatingMain] = useState(0);
    const [ratingUser, setRatingUser] = useState(0);
    const [user, setUser] = useState();
    const [main, setMain] = useState();
    const [id, setId] = useState();


    const handleClick = async (value) => {
        if (props.main && props.main === user) {
            notice.inf("Bạn không thể tự đánh giá bản thân!")
        }
        let idConst;
        await service.rating(main, {
            "ratingValue": value,
            "ratingContent": "user " + user + " đánh giá: " + value + " sao"
        }).then((data) => {
            console.log(data)
        }).catch(async (data) => {
            if (data === "Rating already exist!") {
                try {
                    const data = await service.getRating(props.main);

                    if (data && data.length > 0) {
                        for (const value of data) {
                            if (value.createdByInfo && value.createdByInfo.username === user) {
                                idConst = value.id;
                                await setId(value.id);
                                console.log(value.id);
                                break; // Thoát khỏi vòng lặp nếu đã tìm thấy id
                            }
                        }
                    }
                    if (idConst) {
                        const updateData = {
                            "ratingValue": value,
                            "ratingContent": "user " + user + " đánh giá: " + value + " sao"
                        };

                        const response = await service.updateRating(idConst, updateData);
                        console.log(response);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        })
        await service.getRating(props.main).then(
            (data) => {
                let ratingValue = 0;
                data && data.map((value) => {
                    ratingValue += value.ratingValue;
                    if (value.createdByInfo && value.createdByInfo.username === user) {
                        setRatingUser(value.ratingValue)
                    }
                })
                if (ratingValue !== 0) {
                    setRatingMain((ratingValue / data.length).toFixed(1))
                }
            }
        )

        await setRatingUser(value);
    };

    useEffect(() => {
        let ratingValue = 0;
        setUser(auth.getUserInfo() && auth.getUserInfo().username)
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
                        setRatingMain((ratingValue / data.length).toFixed(1))
                    }
                }
            )
        }

    }, [props.main]);

    return (
        <div className="rating-post-info">
            <p style={{marginRight: "1rem"}}>Rating: {ratingMain}/5</p>
            {auth.getUserInfo() && "("
            }
            {auth.getUserInfo() && [1, 2, 3, 4, 5].map((value) => (
                <span className="rating-start"
                      key={value}
                      onClick={() => handleClick(value)}
                      style={{cursor: 'pointer'}}
                >
          {value <= ratingUser ? '★' : '☆'}
        </span>
            ))}
            {auth.getUserInfo() && "("
            }
        </div>
    );
};

export default StarRating;
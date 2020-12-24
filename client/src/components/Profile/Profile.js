import React, {useEffect, useState, useContext} from 'react'
import img1 from '../../images/5.jpg';
import {UserContext} from '../../App'

function Profile() {

    const {state, dispatch} = useContext(UserContext)
    const [pics, setPics] = useState([]);

    useEffect(()=>{
        fetch('/api/user_post', {
            method: 'GET',
            headers: {
                "Authorization": localStorage.getItem("jwt")
            }
        }).then(res => res.json()).then((data)=>{
            console.log(data.post)
            setPics(data.post);
        })
    }, [])

    return (
        <div className="section1">
            <div className="profile-card">
                <div className="card-heading1">
                    <img src={img1} alt=""/>
                </div>
                <div className="card-content1">
                    <h4>{state ? state.userName : "Loading..."}</h4>
                    <h6>{state ? state.whoAmI : "Loading..."}</h6>
                    <div className="posts">
                        <p>10 posts</p>
                        <p>10 followers</p>
                        <p>10 following</p>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    pics.map(pic=>{
                        return (
                            <img className="galleryimg" src={pic.image} alt="" />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile

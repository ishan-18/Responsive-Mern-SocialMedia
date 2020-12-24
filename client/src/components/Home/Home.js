import React, {useState, useEffect, useContext} from 'react'
import { FaRegCommentAlt, FaThumbsDown, FaThumbsUp, FaTrashAlt } from 'react-icons/fa'
import {UserContext} from '../../App'

function Home() {

    const [data, setData] = useState([]);
    const {state, dispatch} = useContext(UserContext)

    useEffect(()=>{
        fetch('/api/post', {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                "Authorization": localStorage.getItem("jwt")
            }
        }).then(res => res.json()).then((data)=>{
            setData(data);
        })
    }, [])

    const onLike = (id) =>{
        fetch('/api/likes', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json()).then(result=>{
            // console.log(result);
            const newData = data.map(item=>{
                if(item._id == result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        })
    }

    const onUnLike = (id) => {
        fetch('/api/unlikes', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res=>res.json()).then((result)=>{
            // console.log(result)
            const newData = data.map(item=>{
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        })
    }

    const makeComment = (text, postId) =>{
        fetch('/api/comments', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                text,
                postId
            })
        }).then(res => res.json()).then((result)=>{
            console.log(result)
            const newData = data.map(item=>{
                if(item._id == result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        })
    }

    return (
        <>
            <div className="section-home">
                {
                    data.map(item=>{
                        return (
                            <div className="card1" key={item._id}>
                                <div className="card-home">
                                    <div className="card-heading">
                                        <h4>{item.postedBy.userName}</h4>
                                    </div>
                                    <div className="delete-icon">
                                        <i><FaTrashAlt size="20px" /></i>
                                    </div>
                                </div>
                                <div className="card-image">
                                    <h3 style={{margin: "5px"}}>{item.title}</h3>
                                    <img src={item.image} alt="" />
                                </div>
                                <div className="card-icons">
                                    {item.p_like.includes(state._id)              
                                    ? <i><FaThumbsDown size="20px" onClick={()=>{onUnLike(item._id)}} /></i>
                                    : <i><FaThumbsUp size="20px" onClick={()=>{onLike(item._id)}} /></i>
                                    }
                                    <i><FaRegCommentAlt size="20px" /></i>
                                </div>
                                <div className="likes">
                                    <h5>{item.p_like.length} likes</h5>
                                </div>
                                <div className="footer">
                                    <h5>{item.postedBy.userName}:</h5>
                                    <h5>{item.caption}</h5>
                                </div>
                                {
                                    item.p_comment.map(record=>{
                                        return (
                                            <h6>{record.postedBy.userName}: {record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault();
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                <input type="text" className="inputText" placeholder="Add a comment" />
                                </form>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default Home

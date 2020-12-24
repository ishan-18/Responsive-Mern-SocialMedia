import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'

function CreatePost() {

    const history = useHistory()
    const [title, setTitle] = useState("")
    const [caption, setCaption] = useState("")
    const [image, setPostPic] = useState("")
    const [url, setURL] = useState("")

    useEffect(()=>{
        if(url){
            fetch('http://localhost:5000/api/post', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("jwt")
            }, 
            body: JSON.stringify({
                title,
                caption,
                pic: url
            })
            }).then(res => res.json()).then(data=>{
                if(data.err){
                    alert(data.err)
                }else{
                    alert(data.msg)
                    history.push('/')
                }
            })
        }
    }, [url])

    const postDetails = () => {
        const data = new FormData();
        data.append("file", image)
        data.append("upload_preset", "photoholic")
        data.append("cloud_name", "iiiiii")

        fetch('https://api.cloudinary.com/v1_1/iiiiii/image/upload', {
            method: 'POST',
            body: data
        }).then(res => res.json()).then(data=>setURL(data.url));

    }

    return (
        <div className="section-post">
            <h2>Create Post</h2>
            <div className="inputs">
                <label>Title:</label>
                <input type="text" name="title" placeholder="Enter the title" className="inputText" value={title} onChange={(e)=>setTitle(e.target.value)} />
                <label>Caption:</label>
                <input type="text" name="caption" placeholder="Enter the Caption" className="inputText" value={caption} onChange={(e)=>setCaption(e.target.value)} />
                <label>Image:</label>
                <input type="file" name="image" placeholder="Enter the title" className="inputFile" onChange={(e) => setPostPic(e.target.files[0])} />
            </div>
            <div className="row">
                <button type="button" onClick={()=>postDetails()}>Create</button>
            </div>
        </div>
    )
}

export default CreatePost

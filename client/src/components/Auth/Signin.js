import React, {useState, useContext} from 'react'
import {FaUser} from 'react-icons/fa'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'

function Signin() {

    const {state, dispatch} = useContext(UserContext)
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSignin = () => {
        fetch('http://localhost:5000/user/signin', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json()).then((data)=>{
            if(data.err){
                alert(data.err)
            }else{
                localStorage.setItem("jwt", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                dispatch({type: "USER", payload: data.user})
                alert(data.msg)
                history.push('/')
            }
        })
    }

    return (
        <div className="card">
            <div className="card-heading">
                <FaUser size="25px" />
                <h1>Signin</h1>
            </div>
            <div className="card-content">
                <label>Email:</label>
                <input type="email" name="email" id="input" placeholder="Enter your Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                <label>Password:</label>
                <input type="password" name="password" id="input" placeholder="Enter your Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>
            <div className="row">
                <button type="submit" onClick={()=>onSignin()}>Sign in</button> 
                <Link to="/signup">Create An Account?</Link>
            </div>
        </div>
    )
}

export default Signin

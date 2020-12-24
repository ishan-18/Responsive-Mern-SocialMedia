import React, {useState} from 'react'
import {FaUser} from 'react-icons/fa'
import {Link, useHistory} from 'react-router-dom'

function Signup() {

    const history = useHistory();
    const [name, setName] = useState("");
    const [userName, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [whoAmI, setWhoAmI] = useState("");

    const onSignup = () => {
        fetch('http://localhost:5000/user/signup', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                name,
                userName,
                email,
                password,
                whoAmI
            })
        }).then(res => res.json()).then((data)=>{
            if(data.err){
                alert(data.err)
            }else{
                alert(data.msg)
                console.log(data);
                history.push('/signin');
            }
        })
    }

    return (
        <div className="card">
            <div className="card-heading">
                <FaUser size="25px" />
                <h1>Signup</h1>
            </div>
            <div className="card-content">
                <label>Name:</label>
                <input type="text" name="name" id="input" placeholder="Enter your Name" value={name} onChange={(e)=>setName(e.target.value)} />
                <label>Username:</label>
                <input type="text" name="userName" id="input" placeholder="Enter your Username" value={userName} onChange={(e)=>setUsername(e.target.value)} />
                <label>Email:</label>
                <input type="email" name="email" id="input" placeholder="Enter your Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                <label>Password:</label>
                <input type="password" name="password" id="input" placeholder="Enter your Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                <label>Who Are You?</label>
                <input type="text" name="profession" id="input" placeholder="Enter your Profession" value={whoAmI} onChange={(e)=>setWhoAmI(e.target.value)} />
            </div>
            <div className="row">
                <button type="submit" onClick={()=> onSignup()}>Sign up</button> 
                <Link to="/signin">Already Have an Account?</Link>
            </div>
        </div>
    )
}

export default Signup

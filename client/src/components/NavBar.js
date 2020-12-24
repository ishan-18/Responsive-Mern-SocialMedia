import React, {useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'

function NavBar() {

    const {state, dispatch} = useContext(UserContext);
    const history = useHistory();

    const onLogout = () => {
        dispatch({type: "CLEAR"})
        localStorage.clear();
        history.push("/signin");
    }

    const renderList = () => {
        if(state){
            return [
                <li className="list-items"><Link to="/profile" className="links">Profile</Link></li>,
                <li className="list-items"><Link to="/create" className="links">Create</Link></li>,
                <li className="list-items"><Link to="#" className="links" onClick={()=>onLogout()}>Logout</Link></li>
            ]
        }else{
            return [
                <li className="list-items"><Link to="/signup" className="links">Signup</Link></li>,
                <li className="list-items"><Link to="/signin" className="links">Signin</Link></li>
            ]
        }
    }

    return (

        <nav>
            <div className="logo">
                <h1 className="title-1"><Link to={state?"/":"/signin"} style={{color: "#333"}}>SOCIAL</Link></h1>
            </div>
            <ul className="list">
                {renderList()}
            </ul>
        </nav>
    )
}

export default NavBar

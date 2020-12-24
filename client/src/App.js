import React, {useEffect, createContext, useReducer, useContext} from 'react';
import NavBar from './components/NavBar';
import {BrowserRouter as Router, Route, Switch, useHistory} from 'react-router-dom'
import Home from './components/Home/Home';
import Profile from './components/Profile/Profile';
import Signup from './components/Auth/Signup';
import Signin from './components/Auth/Signin';
import CreatePost from './components/CreatePost/CreatePost';
import { initialState, reducer } from './reducer/userReducer';

export const UserContext = createContext()

const Routing = () => {

  const history = useHistory();
  const {state, dispatch} = useContext(UserContext)
  
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    if(user){
      dispatch({type: "USER", payload: user})
      history.push("/");
    }else{
      history.push("/signin")
    }
  }, [])

  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/profile" component={Profile}/>
      <Route path="/signup" component={Signup} />
      <Route path="/signin" component={Signin} />
      <Route path="/create" component={CreatePost} />
    </Switch> 
  )
}

function App() {

  const [state, dispatch] = useReducer(reducer,initialState)

  return (
      <UserContext.Provider value={{state, dispatch}}> 
        <Router>
          <NavBar />
          <Routing />
        </Router>
      </UserContext.Provider>
  );
}

export default App;

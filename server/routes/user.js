const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

//Signup Route
router.post('/signup', async (req,res)=>{
    try {
        const {name, userName, email, password, whoAmI} = req.body;
        if(!name || !userName || !email || !password || !whoAmI){
            return res.status(401).json({err: "Please Enter all the fields"});
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(401).json({err: "User already exists"});
        }

        const user1 = await User.findOne({userName});
        if(user1){
            return res.status(401).json({err: "UserName isn\'t available"});
        }

        if(password.length < 6){
            return res.status(401).json({err: "Password must be of atleast 6 characters"});
        }

        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            return res.status(401).json({err: "Please Enter a valid Email"});
        }

        const hashPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            name, 
            userName,
            email,
            password: hashPassword, 
            whoAmI
        });

        await newUser.save();

        res.json({msg: "User Signed Up Successfully!!"});

    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

router.post('/signin', async (req,res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(401).json({err: "Please Enter all the fields"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({err: "User doesn\'t exists"});
        }

        const doMatch = await bcrypt.compare(password, user.password);
        if(doMatch){

            const token = await jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
            res.json({token, user, msg: "User signed in Successfully"});
        }else{
            return res.status(401).json({err: "Invalid Email or Password"});
        }
    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

router.get('/getUser', auth, async (req,res)=>{
    try {
        const user = await User.findById(req.user._id);
        if(user){
            res.json(user);
        }
    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

module.exports = router;
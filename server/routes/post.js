const router = require('express').Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const User = mongoose.model('User');

router.get('/post', auth, async (req,res)=>{
    try {
        const post = await Post.find().populate('postedBy', 'userName profilePic').populate('p_like.postedBy', 'userName profilePic').populate('p_comment.postedBy', 'userName profilePic').sort('-createdAt');
        if(post){
            res.json(post);
        }
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
})

router.post('/post', auth, async (req,res)=>{
    try {
        const {title, caption, pic} = req.body;
        if(!title || !caption || !pic){
            return res.status(401).json({err: "Please Enter all the fields"});
        }

        const newPost = new Post({
            title,
            caption,
            image: pic,
            postedBy: req.user
        });

        await newPost.save();

        res.json({newPost, msg: "Post created Successfully"});

    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

router.delete('/post/:id', auth, async (req,res)=>{
    try {
        await Post.findOne({_id: req.params.id}).populate('postedBy', '_id').exec((err, post)=>{
            if(err){
                return res.status(401).json({err: err.message});
            }

            if(post.postedBy._id.toString() === req.user._id.toString()){
                const delPost = post.remove();
                res.json({msg: "Post Deleted Successfully"});
            }else{
                return res.status(401).json({err: "Can't delete this post"});
            }
        })
    } catch (err) {
        return res.status(401).json({err: err.message})
    }
})

router.put('/likes', auth, async (req,res)=>{
    try {
        const post = await Post.findByIdAndUpdate(req.body.postId, {
            $push: {p_like: req.user._id}
        }, {
            new: true
        }).populate("postedBy", "_id userName").exec((err, post)=>{
            if(err) throw err;
            res.json(post);
        })
    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

router.put('/unlikes', auth, async (req,res)=>{
    try {
        const post = await Post.findByIdAndUpdate(req.body.postId, {
            $pull: {p_like: req.user._id}
        }, {
            new: true
        }).populate("postedBy", "_id userName").exec((err, post)=>{
            if(err) throw err;
            res.json(post);
        })
    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

router.put('/comments', auth, async (req,res)=>{
    try {
        const comment = {
            text: req.body.text,
            postedBy: req.user._id
        }

        const post = await Post.findByIdAndUpdate(req.body.postId, {
            $push: {p_comment: comment}
        }).populate('postedBy', 'userName').populate('p_comment.postedBy', 'userName profilePic').exec((err, result)=>{
            if(err) throw err;
            res.json(result);
        })

    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

router.put('/uncomments', auth, async (req,res)=>{
    try {
        const comment = {
            text: req.body.text,
            postedBy: req.user
        }

        const post = await Post.findByIdAndUpdate(req.body.postId, {
            $pull: {p_comment: comment}
        }).populate('postedBy', 'userName profilePic').exec((err, result)=>{
            if(err) throw err;
            res.json(result);
        })

    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

router.get('/user_post', auth, async (req,res)=>{
    try {
        const post = await Post.find({postedBy: req.user._id}).populate('postedBy', 'userName profilePic').populate('p_like.postedBy', 'userName profilePic').populate('p_comment.postedBy', 'userName profilePic').sort('-createdAt');
        res.json({post});
    } catch (err) {
        return res.status(500).json({err: err.message});   
    }
})

router.get('/get_profile/:id', auth, async (req,res)=>{
    try {
        const user = await User.findOne({_id: req.params.id});
        if(user){
            await Post.findOne({postedBy: req.params.id}).populate("postedBy", 'userName profilePic').exec((err, posts)=>{
                if(err) throw err;
                res.json({user,posts})
            })
        }
    } catch (err) {
        return res.status(500).json({err: err.message});
    }
})

module.exports = router;
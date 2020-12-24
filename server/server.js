require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

//Models
require('./models/user');
require('./models/post');

//Routes
app.use('/user', require('./routes/user'));
app.use('/api', require('./routes/post'));

const URI = process.env.MONGO_URI;
mongoose.connect(URI, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true
});

mongoose.connection.on('connected', ()=>{
    console.log('Database running');
})

mongoose.connection.on('error', (err)=>{
    console.log("Error:", err);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server responding @${PORT}`);
})

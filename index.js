const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./models/user')
const Chat = require('./models/chats')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

var app =express();

const JWT_SECRET = 'HELL'
mongoose.connect("mongodb://localhost/TaskChat",{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false });

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.get("/",(req,res)=>{
    res.render("login");
})
app.post('/login', async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username }).lean()
	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}
	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful
		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
        )
        return res.redirect("/chats/"+user._id);
	}
	res.json({ status: 'error', error: 'Invalid username/password' })
})
app.get("/chats/:id",async(req,res)=>{
    var oid = req.params.id;
    var msgs = await Chat.find();
    res.render("chats",{oid,msgs});
})
app.post("/msgsend/:o",async(req,res)=>{
    var u = await User.findById(req.params.o);
    var a= {
        id:u._id,
        username:u.username
    };
    var nm = {msg:req.body.msg,owner:a};
    Chat.create(nm,function(err,newmsg){
        if(err){
            console.log(err);
        }else{
            res.redirect("/chats/"+req.params.o);
        }
    })
})

// app.get("/signup",(req,res)=>{
//     res.render("signup");
// })
// app.post('/signup', async (req, res) => {
// 	const { username, password: plainTextPassword } = req.body
// 	if (!username || typeof username !== 'string') {
// 		return res.json({ status: 'error', error: 'Invalid username' })
// 	}
// 	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
// 		return res.json({ status: 'error', error: 'Invalid password' })
// 	}
// 	if (plainTextPassword.length < 5) {
// 		return res.json({
// 			status: 'error',
// 			error: 'Password too small. Should be atleast 6 characters'
// 		})
// 	}
// 	const password = await bcrypt.hash(plainTextPassword, 10)
// 	try {
// 		const response = await User.create({
// 			username,
// 			password
// 		})
// 		console.log('User created successfully: ', response)
// 	} catch (error) {
// 		if (error.code === 11000) {
// 			// duplicate key
// 			return res.json({ status: 'error', error: 'Username already in use' })
// 		}
// 		throw error
// 	}
// 	res.json({ status: 'ok' })
// })

app.listen("3000","0.0.0.0",()=>{
    console.log("started")
})
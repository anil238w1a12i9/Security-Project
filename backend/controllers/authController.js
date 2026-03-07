const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



exports.signup = async (req,res)=>{

try{

const {name,email,password}=req.body;

let user = await User.findOne({email});

if(user){
return res.status(400).json({message:"User already exists"});
}

const hashedPassword = await bcrypt.hash(password,10);

user = new User({
name,
email,
password:hashedPassword
});

await user.save();

res.json({message:"Signup successful"});

}catch(error){

res.status(500).json({message:"Signup failed"});

}

};



exports.login = async (req,res)=>{

try{

const {email,password}=req.body;

const user = await User.findOne({email});

if(!user){
return res.status(400).json({message:"User not found"});
}

const isMatch = await bcrypt.compare(password,user.password);

if(!isMatch){
return res.status(400).json({message:"Invalid password"});
}

const token = jwt.sign(
{ id:user._id },
process.env.JWT_SECRET,
{ expiresIn:"1d" }
);

res.json({token});

}catch(error){

res.status(500).json({message:"Login failed"});

}

};



exports.googleLogin = async (req,res)=>{

try{

const {token}=req.body;

const ticket = await client.verifyIdToken({
idToken:token,
audience:process.env.GOOGLE_CLIENT_ID
});

const payload = ticket.getPayload();

const email = payload.email;
const name = payload.name;

let user = await User.findOne({email});

if(!user){

user = new User({
name,
email,
password:"google-login"
});

await user.save();

}

const jwtToken = jwt.sign(
{ id:user._id },
process.env.JWT_SECRET,
{ expiresIn:"1d" }
);

res.json({token:jwtToken});

}catch(error){

console.log(error);

res.status(500).json({
message:"Google login failed"
});

}

};
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var passport =require('passport');
const db = require('../Db/DbConnection'); 
const jwt = require('jsonwebtoken');
require('dotenv').config();



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID ,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ,
    callbackURL: "/auth/google/callback"
  },
 async (accessToken, refreshToken, profile, cb)=> {
   
   try{
    console.log(profile)
    const email = profile. _json.email;
    
    const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    console.log("Hello",existingUser)

    let user =existingUser;

    
   if(existingUser.length==0) {
        await db.execute('INSERT INTO users (name, email,password,isAdmin) VALUES (?, ?, ?,?)', 
            [profile._json.name, profile._json.email ,"Test@123",0]);

            const [newUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            console.log("Hello New ",newUser)

            user = newUser;
      
    }

    const JWT_SECRET = "BCJSB323SCCBJBSCJS23SCCBJBSCJS23"; 

    const token = jwt.sign({ id: user[0].id, email: user[0].email,isAdmin: user[0].isAdmin }, JWT_SECRET, { expiresIn: '7d' });
    return cb(null, { user:{id:user[0].id,name:user[0].name,email:user[0].email}, token });

  }

catch (error) {

    return cb(error);
}}
));
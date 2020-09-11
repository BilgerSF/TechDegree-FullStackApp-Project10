/*
User Authenthication Process:

1- Parse authorization header into the user's credentials (email and password)
2- Check that user exists by finding the provided email address on the database
3- If the user exists; compare the received password with the password stored on the databse
4- Add a property to the request object with the current user so that
The follow middleware functions will have access to the user's information
example: req.currentUser = authenticated username;
5- use next() method to go to the route handler
*/

//Import user model
const db = require('./db');
const {User} = db.models;

//password hasher module
const bcrypt = require('bcryptjs');
//Basic authorization header parser module\
const auth = require('basic-auth');



async function authenticate(req,res,next){
//1-parse authorization header into the user's credentials (email and password)
    const user = auth(req)
   if(user != undefined){ 
    var username = user.name;
    var password = user.pass;
   }
//Proceed only if a password and username where sent trough authorization header

if( (username != undefined) && (password != undefined) ){     
//2-check that user exists by finding the provided email address on the database
    const userExists = await User.findAll({where:{emailAddress:username}});
//3-if the user exists, hash the password and compare it to the password stored on the databse
    
   if(userExists.length > 0 ){
       //Get database password(hashed)
       const dbPassword = userExists[0].dataValues.password;
       //Compare database password with the password received trough req
       const verifiedPassword = bcrypt.compareSync(password,dbPassword);
       console.log(verifiedPassword)

       //4-if true then the user has been succesfully authenticated(logged in)
        if(verifiedPassword){
             //add user to the req object so that it can be used later in routes
            req.currentUser = userExists[0].dataValues;
            console.log(req.currentUser.emailAddress+' '+'has succesfully logged in')
            //5- Go to the next middleware(route handler in this case)
            next();
        }
        else{
            res.status(401);
            res.json({AuthStatus:"Incorrect username or password"})
        }
    }
    else{
        console.log('User does not exists')
        res.status(401);
        //add password does not exists due to security
        res.json({AuthStatus:"Incorrect username or password"}).end();
    }

  }
// if no authorization header was provided then...  
else{
  res.status(401);
  res.json({AuthStatus:"Access denied. Basic authorization was not provided"})
 }


}

module.exports = {authenticate}
const express =  require('express');
const router = express.Router();
const crud = require('../CRUD');
const {check,body,validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const userAuthentication = require('../userAuthentication');

//.......User Routes.............//

//...............................Returns currently authenticated user....................//
router.get('/users',userAuthentication.authenticate,(req,res)=>{
   
    res.status(200);
    res.json({AuthenticatedUser:{
                                firstName:req.currentUser.firstName,
                                lastName:req.currentUser.lastName,
                                emailAddress:req.currentUser.emailAddress,
                                userId: req.currentUser.id,
                                } 
                               });
});

//.......................................................................................//

//.............................................Creates a user............................//
router.post('/users',[
      check('firstName')
         .exists({ checkNull: true, checkFalsy: true })
         .withMessage('Please provide a value for first name '),
      check('lastName')
         .exists({ checkNull: true, checkFalsy: true })
         .withMessage('Please provide a value for last name '),
      check('emailAddress')
         .exists({ checkNull: true, checkFalsy: true })
         .withMessage('Please provide a value for email ')
         .isEmail()
         .withMessage('Please provide a valid email address '),
      check('password')
         .exists({ checkNull: true, checkFalsy: true })
         .withMessage('Please provide a value for password ')
         .isLength({ min: 5, max: 20 })
         .withMessage('Please provide a password that contains between 5 and 20 characters'),
],
   async (req,res)=>{
//Finds the validation errors in this request and wraps them in an object with handy functions    
const errors = validationResult(req) 
//verify that the received description and title are valid
if(!errors.isEmpty()){
    res.status(400);
    res.json({error:errors.array()});
    
}
//create a user if valdiation passed
else{
    //Create the user(if does not exists already)
    await crud.createUser(req,res);
   }
});
//........................................................................................//



module.exports = router;
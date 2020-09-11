const express = require('express'); 
const router = express.Router(); 
const db = require('../db');
const {Course} = db.models;
const crud = require('../CRUD');
const {check,body,validationResult} = require('express-validator');
const userAuthentication = require('../userAuthentication');

//.............................................Course Routes.................................................//



//..........................Returns a list of courses(including the users that owns each course)............//
router.get('/courses',async (req,res)=>{
    const courses = await crud.getCourses();
    res.status(200);
    res.json(courses);
});

//Returns the course(user included) based on course ID
router.get('/courses/:id', async (req,res)=>{
    const courseId = req.params.id;
    const course = await crud.getCourses(courseId,res);
if(course!=null){
    res.status(200)
    res.json(course);
 }
})
//...........................................................................................................//


//..............................................Creates a course.............................................//
router.post('/courses/',[
    check('title')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a value for the title '),
    check('description')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a value for the description '),
], 

userAuthentication.authenticate, 

async (req,res)=>{
//Finds the validation errors in this request and wraps them in an object with handy functions    
const errors = validationResult(req);
//verify that the received description and title are valid
if(!errors.isEmpty()){
    res.status(400);
    res.json({error:errors.array()});
    
}

//Create a course if validation passed!
  else{
   const course = await crud.createCourse(req);
    const courseId = course.dataValues.id;
    res.status(201);
//Returns id of the created course so it can be used on the location header URI
    res.location(`/courses/${courseId}`).end();
  }
   });

//................................................................................................................//


//.......................................Updates a course and returns no content..................................//
router.put('/courses/:id',[
    check('title')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a value for the title '),
    check('description')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a value for the description '),
    
],
//if authenticated proceeds to route handler
userAuthentication.authenticate,

async (req,res)=>{

//Finds the validation errors in this request and wraps them in an object with handy functions    
  const errors = validationResult(req);
  //verify that the received description and title are valid
if(!errors.isEmpty()){
    res.status(400);
    res.json({error:errors.array()});
}

//Update course if validation passed 
else{
    const courseId = req.params.id;
    await crud.updateCourse(courseId,req,res); 
}

});

//................................................................................................................//


//......................................Deletes a courses and returns no content..................................//
router.delete('/courses/:id',

userAuthentication.authenticate,

async (req,res)=>{
    await crud.deleteCourse(req.params.id,req,res);
});
//.................................................................................................................//


module.exports = router;
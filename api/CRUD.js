const db = require('./db');
const {User,Course} = db.models;
//password hasher module
const bcrypt = require('bcryptjs');
const { Sequelize } = require('./db');

//..................................................Users CRUD............................................................//

//..........Create a user.........//
async function createUser(req,res){

  // check if username already exists
  const emailExists = await User.findAll({where:{emailAddress:req.body.emailAddress}});

if(emailExists.length < 1){
   try{
     //hash the password before inserting password to database
     const salt = bcrypt.genSaltSync();
     const hash = bcrypt.hashSync(req.body.password,salt);
      await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress,
        password: hash
      });
      //Send response of success
      res.status(201);
      res.location('/').end();
     }
    catch(error){
      if (error.name === 'SequelizeValidationError') {
          const errors = error.errors.map(err => err.message);
           console.error('Validation errors: ', errors);
        } 
        else {
            throw error;
          }
      }
    }
  
else{
    res.status(409);
    res.json({Status: "User already exists"})
  }
}

//..................................................Courses CRUD............................................................//

//Get courses with user
async function getCourses(courseId,res){
  let courses;
  if(courseId === undefined){
     courses = await Course.findAll({attributes:['id','userId','title','description','estimatedTime','materialsNeeded'],
                                     include:[ {model:User,attributes:['firstName','lastName','emailAddress']}  ]});
  }
  else{
    courses = await Course.findByPk(courseId,{attributes:['id','userId','title','description','estimatedTime','materialsNeeded'],
                               include:[ {model:User,attributes:['firstName','lastName','emailAddress']}  ]});
  }
  if(courses!=null){
     return courses 
  }
  else{
    res.status(404).end();
  }   
}


//Create a course
async function createCourse(req){
   try{
     var newCourse =   await Course.create({
          "userId": req.body.userId,
          "title": req.body.title,
          "description": req.body.description,
          "estimatedTime": req.body.estimatedTime,
          "materialsNeeded": req.body.materialsNeeded       
      });
   }
   catch(error){
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
       console.error('Validation errors: ', errors);
    } 
    else {
        throw error;
      }
   }
  return newCourse
}

//Update a course
async function updateCourse(courseId,req,res){

  //Verify that the course exitst before proceeding
  const courseExists = await Course.findByPk(courseId);
 
if(courseExists != null){

 //......check if the logged in user matches the user related to that course to be updated.....//
  const currentUser = req.currentUser.emailAddress;
 //get users email from course
  const databaseUserObj = await Course.findByPk(courseId,{include:[{model:User,attributes:["emailAddress"]}] });
  const databaseUserEmail = databaseUserObj.User.dataValues.emailAddress;
  //............................................................................................//
  const course =  await Course.findByPk(courseId);
  course.title = req.body.title;
  course.description = req.body.description;
  course.estimatedTime = req.body.estimatedTime;
  course.materialsNeeded = req.body.materialsNeeded;
 
  //Update only if the course belong to the current authenticated user
  if( databaseUserEmail === currentUser){
    await course.save();
    //Success respond
    res.status(204);
    res.end();
  }
  else{
    res.status(403)
    res.json({UpdateStatus:"This course belongs to another user"});
  }

}
else{
  res.status(404).end();
}
  
}

//Delete a course
async function deleteCourse(courseId,req,res){
   
  //Verify that the course exitst before proceeding
   const courseExists = await Course.findByPk(courseId);
if(courseExists!=null){
   //......check if the logged in user matches the user related to that course to be updated.....//
    const currentUser = req.currentUser.emailAddress;
   //get users email from course
    const databaseUserObj = await Course.findByPk(courseId,{include:[{model:User,attributes:["emailAddress"]}] });
    const databaseUserEmail = databaseUserObj.User.dataValues.emailAddress;
   //.............................................................................................//
   
  //Delete a course only if the course belongs to the authenticated user
  if(databaseUserEmail === currentUser){
    //find course
      const course = await Course.findByPk(courseId);
    //Delete 
      await course.destroy();
      res.status(204);
      res.end();
  }
  else{
    res.status(403);
    res.json({Status:"This course belongs to another user"});
  }
}
else{
  res.status(404).end();
}

}



//Export all the functions
module.exports = {createUser:createUser,
                  getCourses:getCourses,
                  createCourse:createCourse,
                  updateCourse:updateCourse,
                  deleteCourse:deleteCourse
                }
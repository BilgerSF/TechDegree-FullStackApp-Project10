import React from 'react';
import {Consumer} from '../App';
//base64 encoder
const base64 = require('base-64');
let validationErrJSX;
let courseId;
let loggedinUserId;
let statusCode;

class UpdateCourse extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            User:'',
            course:'',
            description:'',
            estimatedTime:'',
            materialsNeeded:'',
            validationErr:{
              Display:'',
              Title:'',
              Description:''
            }
        }
        this.goBack = this.goBack.bind(this);
        this.updateCourse = this.updateCourse.bind(this);
        this.keyHandler = this.keyHandler.bind(this);
    }

  //Gets course details when the component renders
   componentDidMount(){
    //get courseid
    courseId = this.props.location.pathname.slice(9).slice(0,-7);
    //get course data
    fetch(`http://localhost:5000/api/courses/${courseId}`,{
       method:'GET'
    })
    .then((res)=>{
       if(res.status === 404){
        statusCode = res.status;
        this.props.history.push("/notfound");
        throw new Error('Not found');
      }
      else{
      return res.json()
      }
    })
    .then((data)=>{
      let name = data.User.firstName + ' ' + data.User.lastName;
      
      if(data.userId === loggedinUserId){
        this.setState({
          User: name,
          course: data.title,
          description: data.description,
          estimatedTime: data.estimatedTime,
          materialsNeeded: data.materialsNeeded
        })
      }
      else{
        this.props.history.push('/forbidden')
      }
     })
     .catch((error)=>{
       if(statusCode !== 404){
      console.error(error,'Server error.Status code: 500');
      this.props.history.push('/error')
       }
     })
    
   }

//navigates to the previous page
   goBack(e){
    this.props.history.goBack();
    e.preventDefault();
   }

  //Displays validadion error messages
   setValidationState(Title,Description){
    this.setState({validationErr:{
      Display: 'Validation Errors',
      Title: Title,
      Description: Description,
      }}) 
  }

 //Updates course if the course belong to the authorized user
   updateCourse(email,password){
    return (e)=> {
      e.preventDefault();
      fetch(`http://localhost:5000/api/courses/${courseId}`,{
          method: 'PUT',
          headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": `Basic ${base64.encode(`${email}:${password}`)}`
           },
           body: JSON.stringify({
             title: this.state.course,
             description: this.state.description,
             estimatedTime: this.state.estimatedTime,
             materialsNeeded: this.state.materialsNeeded
           })
      })
      .then((res)=>{
        if(res.status === 400){ 
        return res.json()
        }
        
       })
      .then((data)=>{
        if(data !== undefined){
           if(data.error.length === 2){
             this.setValidationState(data.error[0].msg,data.error[1].msg);
           }
            else if(data.error.param === 'description'){
             this.setValidationState('',data.error[0].msg);
            }
            else {
             this.setValidationState(data.error[0].msg,'');
            }
         }
         //Redirect to courses list when succesfully created
         else{
          this.props.history.goBack();
         }
     })
      .catch((error)=>{ 
        console.error(error,'Server error.Status code: 500');
        this.props.history.push('/error')
      })
    }  
   }

  //sets state properties with form input data
   keyHandler(e){
    if(e.target.id === 'title'){
      this.setState({course:e.target.value});
     }
     else if(e.target.id === 'estimatedTime'){
       this.setState({estimatedTime:e.target.value});
     }
     else if(e.target.id === 'description'){
       this.setState({description:e.target.value});
     }
     else if(e.target.id === 'materialsNeeded'){
       this.setState({materialsNeeded:e.target.value});
     }

   }


    render(){
        return(
          <Consumer>
            {
              (context)=>{
                if( (this.state.validationErr.Title) || (this.state.validationErr.Description) ){
                    validationErrJSX =  <div>
                                            <h2 className="validation--errors--label">{this.state.validationErr.Display}</h2>
                                              <div className="validation-errors">
                                                  <ul>
                                                    <li>{this.state.validationErr.Title}</li>
                                                    <li>{this.state.validationErr.Description}</li>
                                                  </ul>
                                              </div>
                                          </div>
                }
                else{
                  validationErrJSX = '';
                }

                loggedinUserId = context.userId;
                return(
                   <div>
                  
                  <hr />
                  <div className="bounds course--detail">
                    <h1>Update Course</h1>
                    <div>
                    {validationErrJSX}

                    <form>
                      <div className="grid-66">
                        <div className="course--header">
                          <h4 className="course--label">Course</h4>
                          <div>
                            <input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." value={this.state.course} onChange = {this.keyHandler}  /></div>
                          <p>By {this.state.User}</p>
                        </div>
                        <div className="course--description">
                          <div><textarea id="description" name="description"  placeholder="Course description..." value={this.state.description} onChange = {this.keyHandler} /></div>
                        </div>
                      </div>
                      <div className="grid-25 grid-right">
                        <div className="course--stats">
                          <ul className="course--stats--list">
                            <li className="course--stats--list--item">
                              <h4>Estimated Time</h4>
                              <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" value={this.state.estimatedTime} onChange = {this.keyHandler} /></div>
                            </li>
                            <li className="course--stats--list--item">
                              <h4>Materials Needed</h4>
                              <div><textarea id="materialsNeeded" name="materialsNeeded"  placeholder="List materials..." value={this.state.materialsNeeded} onChange = {this.keyHandler} /></div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="grid-100 pad-bottom">
                      <button className="button" type="submit" onClick = {this.updateCourse(context.username,context.password)}>Update Course</button>
                      <button className="button button-secondary" onClick = {this.goBack} >Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
                )}
              }
          </Consumer>
        );
    }
}

export default UpdateCourse;
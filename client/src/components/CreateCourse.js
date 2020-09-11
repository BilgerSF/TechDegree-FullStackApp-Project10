import React from 'react';
import {Link} from 'react-router-dom';
import {Consumer} from '../App';
//base64 encoder
const base64 = require('base-64');
let validationErrJSX;

class CreateCourse extends React.Component{
    constructor(props){
        super(props)
        this.state = {
           title:'',
           estimatedTime:'',
           description:'',
           materialsNeeded:'',
           validationErr:{
             Display:'',
             Title:'',
             Description:''
           }

          }
        this.createCourse = this.createCourse.bind(this);
        this.keyHandler = this.keyHandler.bind(this);
    }
    
    //Sets validation errors on the state
    setValidationState(Title,Description){
      this.setState({validationErr:{
        Display: 'Validation Errors',
        Title: Title,
        Description: Description,
        }}) 
    }

    //Create a course on the database
    createCourse(email,password,userId){
     return (e)=> {
       e.preventDefault();
       fetch('http://localhost:5000/api/courses',{
       method: 'POST',
       headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "Authorization": `Basic ${base64.encode(`${email}:${password}`)}`
       },
       body: JSON.stringify({
         userId: userId,
         title: this.state.title,
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
            this.props.history.push('/');
          }
      })
       .catch((error)=>{ 
        console.error(error,'Server error.Status code: 500');
        this.props.history.push('/error')
         })
      }
      
    }

    //sets the state with the data being entered on the form
    keyHandler(e){
      if(e.target.id === 'title'){
        this.setState({title:e.target.value});
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
                  validationErrJSX =    <div>
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

                 return(
                  <div>
                  
                  <hr />
                  <div className="bounds course--detail">
                    <h1>Create Course</h1>
                    <div>
                       {validationErrJSX}
                  
                      <form onSubmit = {this.createCourse(context.username,context.password,context.userId)} >
                        <div className="grid-66">
                          <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." onChange = {this.keyHandler} /></div>
                            <p>By Joe Smith</p>
                          </div>
                          <div className="course--description">
                            <div><textarea id="description" name="description"  placeholder="Course description..." onChange = {this.keyHandler} /></div>
                          </div>
                        </div>
                        <div className="grid-25 grid-right">
                          <div className="course--stats">
                            <ul className="course--stats--list">
                              <li className="course--stats--list--item">
                                <h4>Estimated Time</h4>
                                <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" onChange = {this.keyHandler} /></div>
                              </li>
                              <li className="course--stats--list--item">
                                <h4>Materials Needed</h4>
                                <div><textarea id="materialsNeeded" name="materialsNeeded"  placeholder="List materials..." onChange = {this.keyHandler}  /></div>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="grid-100 pad-bottom"><button className="button" type="submit">Create Course</button>
                        <Link className="button button-secondary" to = '/' >Cancel</Link></div>
                      </form>

                    </div>
                  </div>
                </div>
                 )}}
          </Consumer>
        );
    }
}

export default CreateCourse;
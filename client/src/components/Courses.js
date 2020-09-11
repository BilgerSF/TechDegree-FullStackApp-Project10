import React from 'react';
import {NavLink} from 'react-router-dom';

class Courses extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            courses: []
        };
    }

//Fetches list of courses
    componentDidMount(){
        
        fetch('http://localhost:5000/api/courses',{  headers:{ 'Content-Type': 'application/json; charset=utf-8' }})
        
        .then((res)=>{
           return res.json()
        })
        .then((data)=>{
          //set the state with the fetched courses 
          this.setState({courses:data})
         })
        .catch((err)=>{
         console.error(err,'Server error.Status code: 500');
         this.props.history.push('/error')
        });
      }

    render(){
        return(
            <div className = 'bounds'>
                {
                   this.state.courses.map((element,i) => {
                    let uri = 'courses/'+element.id;
                    i = i+'course';
                   return(
                          <div className = 'grid-33' key = {i} >
                            <NavLink className = 'course--module course--link' to = {uri} >
                                <h4 className = 'course--label'>Course</h4>
                                <h3 className = 'course--title'>{element.title}</h3>
                            </NavLink>
                          </div>  
                        )
                    })
                }
                 <div className="grid-33"><NavLink className="course--module course--add--module" to="/courses/create">
                        <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
                        <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 " />
                        </svg>New Course</h3>
                    </NavLink></div>
           </div>
        );
    }
}

export default Courses






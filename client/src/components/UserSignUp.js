import React from 'react';
import {NavLink,Link} from 'react-router-dom';


class UserSignUp extends React.Component{
    constructor(props){
        super(props)
        this.state = {
           firstName:'',
           lastName:'',
           emailAddress:'',
           password:'',
           confirmPassword:'',
           display:'',
           matched:'',
           validationErrors:[]
        }
        this.keyHandler = this.keyHandler.bind(this);
        this.signUp = this.signUp.bind(this);
    }

   
   goBack(e){
    this.props.history.goBack();
    e.preventDefault();
   }

     signUp(e){
      e.preventDefault()
      // check if passwords match
      if(this.state.password === this.state.confirmPassword){
        
        fetch('http://localhost:5000/api/users',
        {method:'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          emailAddress: this.state.emailAddress,
          password: this.state.password
        })
      })
      .then( (res)=>{
        if(res.status === 400 || res.status === 409){
        //Return response 
        return res.json()
        }
               
       })
      .then(async (data)=>{

        if(data !== undefined){
          if(data.error !== undefined){
          this.setState({validationErrors: data.error,display:'Validation Errors'});
          }
          else if( data.Status !== undefined){
            this.setState({validationErrors: [{msg:data.Status}],display:'Validation Errors'});
          }
         }
         
         //Redirect to courses list when succesfully signed up
         else{
           //Sign in the user
        await this.props.signIn(this.state.emailAddress,this.state.password,'/')
          //this.props.history.goBack();
         }
     })
      .catch((error)=>{ 
        console.error(error,'Server error.Status code: 500');
        this.props.history.push('/error')
       })
       }

       //If passwords didn't match
       else{
         this.setState({matched:'Passwords do not match',display:'Validation Errors'});
       }
    }

  //Displays error messages received from the api when the form is subbmitted with empty inputs
    validationErrorsDisplayer(){
     if(this.state.validationErrors.length >= 1){ 
      return(
              <div>
              <h2 className="validation--errors--label">{this.state.display}</h2>
              <div className="validation-errors">
              <ul> 
              <li>{this.state.matched}</li>
          {
            this.state.validationErrors.map( (errMSG,i)=> {
              return(<li key = {i}>{errMSG.msg}</li>)
            })
          }
              </ul>
              </div>
          </div>
             )
          }
    }


    keyHandler(e){
      if(e.target.id === 'firstName'){
       this.setState({firstName:e.target.value});
      }
      else if(e.target.id === 'lastName'){
        this.setState({lastName:e.target.value});
      }
      else if(e.target.id === 'emailAddress'){
        this.setState({emailAddress:e.target.value});
      }
      else if(e.target.id === 'password'){
        this.setState({password:e.target.value});
      }
      else if(e.target.id === 'confirmPassword'){
        this.setState({confirmPassword:e.target.value});
      
      }
    }

    render(){
      
        return(
          
            <div>
            
            <hr />
            <div className="bounds">
              <div className="grid-33 centered signin">
                <h1>Sign Up</h1>
                {this.validationErrorsDisplayer()}
                <div>
                  <form onSubmit = {this.signUp}>
                    <div><input id="firstName" name="firstName" type="text"  placeholder="First Name" onChange = {this.keyHandler} /></div>
                    <div><input id="lastName" name="lastName" type="text"  placeholder="Last Name" onChange = {this.keyHandler} /></div>
                    <div><input id="emailAddress" name="emailAddress" type="text"  placeholder="Email Address" onChange = {this.keyHandler} /></div>
                    <div><input id="password" name="password" type="password"  placeholder="Password" onChange = {this.keyHandler} /></div>
                    <div><input id="confirmPassword" name="confirmPassword" type="password"  placeholder="Confirm Password" onChange = {this.keyHandler} /></div>
                    <div className="grid-100 pad-bottom"><button className="button" type="submit">Sign Up</button><Link className="button button-secondary" to = '/'>Cancel</Link></div>
                  </form>

                </div>
                <p>&nbsp;</p>
                <p>Already have a user account? <NavLink to = '/signin'>Click here</NavLink> to sign in!</p>
              </div>
            </div>
              
                 
          </div>
        )
    }

}

export default UserSignUp;
import React from 'react';
import {Consumer} from '../App';
import {NavLink,Link} from 'react-router-dom';
let targetURI = '';
let validationJSX;


class UserSignIn extends React.Component{
  
    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:'',
            valdationErr:''
           
        }
        this.passwordHandler = this.passwordHandler.bind(this);
        this.emailHandler = this.emailHandler.bind(this);
        this.submitForm = this.submitForm.bind(this);
       }
   
  

    async submitForm(e){
      let valdationErr;
      e.preventDefault();
      valdationErr = await this.props.signIn(this.state.email,this.state.password,targetURI);
      this.setState({valdationErr:valdationErr});
    }
    
    
    emailHandler(event){
      this.setState({email: event.target.value})
    }

    passwordHandler(event){
      this.setState({password: event.target.value})
    }
    
    render(){
     //Assign target URI if user was redirected to Sign In page
    if(this.props.location !== undefined){
     if( this.props.location.state !== undefined){
         targetURI = this.props.location.state.from.pathname;
     }
    }
     
        return(
        
        <Consumer>
          { context =>{
           if(this.state.valdationErr){
            validationJSX = <h3 className = 'validation-errors'>  {this.state.valdationErr} </h3>
           }
           else{
            validationJSX = '';
           }
            return(
            <div>
            
            <hr />
            <div className="bounds">
              <div className="grid-33 centered signin">
                <h1>Sign In</h1>
                {validationJSX}
                <div>

                  <form onSubmit = {this.submitForm} >
                    <div><input onChange = {this.emailHandler} value = {this.state.keys} id="emailAddress" name="emailAddress" type="text"  placeholder="Email Address"  /></div>
                    <div><input onChange = {this.passwordHandler} value = {this.state.keys}  id="password" name="password" type="password"  placeholder="Password"  /></div>
                    <div className="grid-100 pad-bottom"><button className="button" type="submit">Sign In</button><Link className="button button-secondary" to = '/'>Cancel</Link></div>
                  </form>

                </div>
                <p>&nbsp;</p>
                <p>Don't have a user account? <NavLink to = '/signup' >Click here</NavLink> to sign up!</p>
              </div>
            </div>
            
          </div>
             )}
        }
        </Consumer>

        );
    }
}

export default UserSignIn;
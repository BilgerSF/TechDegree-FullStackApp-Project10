import React from 'react';
import './App.css';
//react router npm module
import {Route,Switch,withRouter} from 'react-router-dom';
//Import components
import Courses from './components/Courses'
import CourseDetail from './components/CourseDetail';
import Header from './components/Header';
import UserSignIn from './components/UserSignIn';
import UserSignUp  from './components/UserSignUp';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import UserSignOut  from './components/UserSignOut';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './components/NotFound';
import Forbidden  from  './components/Forbidden';
import UnhandledError  from './components/UnhandledError';

//base64 encoder
const base64 = require('base-64');

//context API
const ContextAPI = React.createContext();
const Provider = ContextAPI.Provider;
const Consumer = ContextAPI.Consumer;
let statusCode = 201;


class App extends React.Component{
  constructor(){
    super()
    this.state = {
      username:'',
      password:'',
      userId:'',
      authenticated: '',
      firstName:'',
      lastName:'',
      signedOut: false
    }
     this.signIn = this.signIn.bind(this);
     this.signOut = this.signOut.bind(this);
  }


  //Gets user data from the local storage
  //Sets the state with user data from local storage
  componentDidMount(){
    let authBoolean;
    //Convert string to boolean
    if(localStorage.getItem('authenticated')=== 'true'){
      authBoolean = true;
    }
    else {
      authBoolean = false;
    }
    //Set state only if the user is not logged out of the app
     if(localStorage.getItem('signedOut') !== 'true' ){
       let userIdString = localStorage.getItem('userId');
       let userIdInteger = parseInt(userIdString);
 
      this.setState({
        password: localStorage.getItem('password'),
        username: localStorage.getItem('username'),
        firstName: localStorage.getItem('firstName'),
        lastName: localStorage.getItem('lastName'),
        userId: userIdInteger,
        authenticated: authBoolean,
         })
       }
    }


  //Globally available sign in method
  //Sets the state and local storage with the logging inputs provided by the user (if authenticated)
  //Authentication is done by calling the REST API 
    async signIn(email,password,targetURI){
    
        await fetch('http://localhost:5000/api/users', {
                headers: new Headers({
              "Authorization": `Basic ${base64.encode(`${email}:${password}`)}`
                }),
            })
          .then((res)=> { 
                statusCode = res.status;
                //Proceed only if the user was authenticated
                if(res.status === 200){
                return res.json()
                }
                else{
                  throw new Error('Unauthorized')
                }
            })
          .then((data)=>{
              //Set state with username if user was authorized
              this.setState({
                  username: data.AuthenticatedUser.emailAddress,
                  password: password,
                  userId: data.AuthenticatedUser.userId,
                  firstName: data.AuthenticatedUser.firstName,
                  lastName: data.AuthenticatedUser.lastName,
                  authenticated: true,

            });

              //Store the authenticated user on the local storage for later usage
              localStorage.setItem('authenticated',true);
              localStorage.setItem('password',password);
              localStorage.setItem('userId',data.AuthenticatedUser.userId);
              localStorage.setItem('username',data.AuthenticatedUser.emailAddress);
              localStorage.setItem('firstName',data.AuthenticatedUser.firstName);
              localStorage.setItem('lastName',data.AuthenticatedUser.lastName);
              localStorage.setItem('signedOut',false);
          })

          .catch((error)=>{
            //redirect to error page if the error was caused by server error only
              if(statusCode !== 401){
              console.error(error,'Unable to signing')
              this.props.history.push('/error')
              }
          })

          //Return validation error message if incorrect password or username
          if(statusCode === 401){
          return 'Incorrect Username or Password'
          }
          if(statusCode === 200){
          //Redirect to final destination
          setTimeout(()=>{this.props.history.push(targetURI);},100)
          }
   }

    //Sign out user
    signOut(){
      
      if( (this.state.username !== null) || (this.state.password !== null) ){
            this.setState({username:null,
                            password:'',
                            userId:'',
                            authenticated: false,
                            firstName:'',
                            lastName:'',
                            signedOut: true,
                            signinValidation:''
                        });
            localStorage.setItem('signedOut',true);
        }
        // clear local storage
        localStorage.clear();
      }


   render(){

    return(

      <Provider value = {{signIn:this.signIn, signOut:this.signOut,
                         authenticated:this.state.authenticated,
                         username: this.state.username,
                         password: this.state.password,
                         userId:this.state.userId,
                         firstName:this.state.firstName,
                         lastName:this.state.lastName,
                         signinValidation: this.state.signinValidation
                         }}>

         <Header />

          <Switch>
            <Route exact path = '/' component = {Courses}/>
            <PrivateRoute exact path="/courses/create" component = {CreateCourse} />
            <PrivateRoute exact path='/courses/:id/update' component = {UpdateCourse} />
            <Route exact path = '/courses/:id' component = {CourseDetail} />
            <Route exact path = '/signin' render={() => <UserSignIn history = {this.props.history} signIn = {this.signIn} />}  />
            <Route exact path = '/signup' render = {()=><UserSignUp history = {this.props.history} signIn = {this.signIn}/>} />
            <Route exact path = '/signout' component = {UserSignOut} />
            <Route exact path = '/forbidden' component = {Forbidden} />
            <Route exact path = '/notfound ' component = {NotFound} />
            <Route exact path = '/error' component = {UnhandledError} />
            <Route component = {NotFound} />
          </Switch>
        
        
      </Provider>

      );
   }
}

//Export context consumer
export {Consumer,ContextAPI}
//Export component
export default withRouter(App);


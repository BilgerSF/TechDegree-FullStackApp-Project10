import React from 'react';
import {NavLink} from 'react-router-dom';
import {Consumer} from '../App'
let JSXButtons;

//This component is used for navigation only

function Header(props){

    return(
       <Consumer> 
        {
            (context) =>{

            if(!context.authenticated){
            JSXButtons = 
            <nav>
            <NavLink exact to = '/signup'>Sign Up</NavLink>
            <NavLink to = '/signin'>Sign In</NavLink>
            </nav>
            }
            else{
                JSXButtons = 
                <nav>
                <span>Welcome {context.firstName} {context.lastName}!</span>
                <NavLink to = '/signout'>Sign out</NavLink>
                </nav>
            }
                return(
                <div className="header">
                    <div className ="bounds">
                    <NavLink to = '/'><h1 className ="header--logo">Courses</h1></NavLink>
                    {JSXButtons}
                    </div>
            </div>
                )}
        
            }
      </Consumer> 
    )
}

export default Header;
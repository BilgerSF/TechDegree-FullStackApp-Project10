/*
doesn't render any visual elements. Instead, it signs out 
the authenticated user and redirects the user to the default route
*/
import React, { useContext } from 'react';
import {ContextAPI} from '../App';
import {Redirect} from 'react-router-dom';


function UserSignOut(){
//Access context by using context hook
const context = useContext(ContextAPI); 
//SetTimeout removes warning '1.chunk.js:50870 Warning: Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state.'
setTimeout(()=>{context.signOut();},0)

    return(
        <Redirect to = '/' />
    )
}

export default UserSignOut;
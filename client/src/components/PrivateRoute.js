import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Consumer } from '../App';

/*displays the target component only if the user is authorized, otherwise the user gets redirected to the signing page then back
 to the target URI (once authenticated)
*/

export default ({ component: Component, ...rest }) => {
  return (
    <Consumer>
      {context => (

        <Route
          {...rest}
          //if true
          render={props =>  localStorage.getItem('authenticated') ? (
              <Component {...props} />
            ) 
           //if false  
            : (
            
              <Redirect to={{
                pathname: '/signin',
                state: { from: props.location }
              }} />
            )
          }
        />
    )}
    </Consumer>
  );
};
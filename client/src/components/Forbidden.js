import React from 'react';

//This component is used for displaying a forbidden page when the user tries to access an unauthorized URI
function Forbidden(){
    return(
        <div className="bounds">
        <h1>Forbidden</h1>
        <p>Oh oh! You can't access this page.</p>
      </div>
    );
}

export default Forbidden;
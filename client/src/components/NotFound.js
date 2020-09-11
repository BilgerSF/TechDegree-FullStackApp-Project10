import React from 'react';

//This component is used for displaying a not foundPage when the URL does not exists
function NotFound(props){
    return(
        <div className="bounds">
        <h1>Not Found</h1>
        <p>Sorry! We couldn't find the page you're looking for.</p>
      </div>
    );
}

export default NotFound;
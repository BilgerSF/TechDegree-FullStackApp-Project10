import React from 'react';

//This component is used for displaying an error page when there is a failiure on the server
function UnhandledError(){
    return(
        <div className="bounds">
        <h1>Error</h1>
        <p>Sorry! We just encountered an unexpected error.</p>
      </div>
    );
}

export default UnhandledError;
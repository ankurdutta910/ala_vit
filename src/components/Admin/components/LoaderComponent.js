import React from "react";
import { Loader } from "semantic-ui-react";

function LoaderComponent({message}) {
  return (
    <>
      <div className="mainloaderDiv">
         <div className="d-flex loaderComponent">
        <Loader active inline="centered" size="large">
          {message}
        </Loader>
      </div>
     </div>
    </>
  );
}

export default LoaderComponent;

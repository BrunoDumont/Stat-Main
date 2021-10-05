import React from "react";


const BodyWrapper:React.FC = (props) => {
    return (
        <div className="m-2 mt-6 md:m-6">
          {props.children}
        </div>
    )
}

export default BodyWrapper
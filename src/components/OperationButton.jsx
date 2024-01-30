import React from "react";

export default function OperationButton(props) {
  return (
    <button
      className={`${props.className} operator`}
      onClick={() => {
        props.dispatch({
          type: "CHOOSE_OPERATION",
          payload: props.operation,
        });
      }}
    >
      {props.operation}
    </button>
  );
}

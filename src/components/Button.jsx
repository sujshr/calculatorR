import React from "react";
export default function Button(props) {
  return (
    <button
      onClick={() => {
        props.dispatch({ type: "ADD_DIGIT", payload: props.value });
      }}
    >
      {props.value}
    </button>
  );
}

import React from "react";
export default function SpecialButton(props) {
  return (
    <button
      className={`${props.className} special`}
      onClick={() => {
        props.dispatch({ type: props.type });
      }}
    >
      {props.name}
    </button>
  );
}

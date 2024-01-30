import "./App.css";
import { useReducer } from "react";

// imorting the components
import Button from "./components/Button";
import OperationButton from "./components/OperationButton";
import SpecialButton from "./components/SpecialButton";

// defining the formatter and the formatter function
const formatter = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;

  const [integer, decimal] = operand.split(".");

  if (decimal == null) {
    return formatter.format(integer);
  }

  return `${formatter.format(integer)}.${decimal}`;
}

// function to calculate the result based on values present in the state
function calculate(state) {
  const prev = parseFloat(state.previousOperand);
  const current = parseFloat(state.currentOperand);
  const operation = state.operation;

  if (isNaN(prev) || isNaN(current)) return "";
  let ans = 0;

  switch (operation) {
    case "+":
      ans = prev + current;
      break;
    case "-":
      ans = prev - current;
      break;

    case "/":
      ans = prev / current;
      break;

    case "X":
      ans = prev * current;
      break;
  }

  return ans.toString();
}

// the reducer function
function reducer(state, action) {
  const type = action.type;
  const payload = action.payload;

  switch (type) {
    case "ADD_DIGIT":
      // check if the current state should overwrite the existing operand
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload,
          overwrite: false,
        };
      }

      // check if the new payload is 0 and the current operand is also 0
      if (payload == 0 && state.currentOperand == 0) {
        return state;
      }

      // check if the new payload is a decimal point and the current operand already contains one
      if (payload == "." && (state.currentOperand || "").includes(".")) {
        return state;
      }

      // if none of the above conditions are met, append the new payload to the current operand
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload}`,
      };

    case "CHOOSE_OPERATION":
      // check if both current and previous operands are null
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      // check if the current operand is null
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload,
        };
      }

      // check if the previous operand is null
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      // if none of the above conditions are met, perform calculation and update state
      return {
        ...state,
        previousOperand: calculate(state),
        operand: payload,
        currentOperand: null,
      };

    case "CLEAR":
      return {};

    case "DELETE_DIGIT":
      // check if overwrite is true
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }

      // check if the current operand is null
      if (state.currentOperand == null) {
        return state;
      }

      // check if the length of the current operand is 1
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1),
        };
      }

      // remove the last character from the current operand
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case "EVALUATE":
      // check if any of the required operands or operation is null
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      // perform calculation and update the state
      return {
        ...state,
        overwrite: true,
        currentOperand: calculate(state),
        previousOperand: null,
        operation: null,
      };
  }
}

function App() {
  const [{ currentOperand, previousOperand, operation, overwrite }, dispatch] =
    useReducer(reducer, {});

  return (
    <>
      <div className="calculator">
        <div id="numberDiv">
          <div id="expression">
            {formatOperand(previousOperand)} {operation}
          </div>

          <div id="number">{formatOperand(currentOperand)}</div>
        </div>

        <div id="buttons">
          <SpecialButton
            className="spanTwo"
            dispatch={dispatch}
            type="CLEAR"
            name="AC"
          />
          <SpecialButton dispatch={dispatch} type="DELETE_DIGIT" name="DEL" />

          <OperationButton operation="/" dispatch={dispatch} />

          <Button value="7" dispatch={dispatch} />
          <Button value="8" dispatch={dispatch} />
          <Button value="9" dispatch={dispatch} />

          <OperationButton operation="X" dispatch={dispatch} />

          <Button value="4" dispatch={dispatch} />
          <Button value="5" dispatch={dispatch} />
          <Button value="6" dispatch={dispatch} />

          <OperationButton operation="+" dispatch={dispatch} />

          <Button value="1" dispatch={dispatch} />
          <Button value="2" dispatch={dispatch} />
          <Button value="3" dispatch={dispatch} />

          <OperationButton operation="-" dispatch={dispatch} />

          <Button value="." dispatch={dispatch} />
          <Button value="0" dispatch={dispatch} />

          <SpecialButton
            className="spanTwo"
            dispatch={dispatch}
            type="EVALUATE"
            name="="
          />
        </div>
      </div>
    </>
  );
}

export default App;

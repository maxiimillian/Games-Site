function NumberButton(props) {
  return (
    <div className="number-button-container">
      <span onClick={(e) => props.handleClick(props.number)}>
        {props.number}
      </span>
    </div>
  );
}

export default NumberButton;

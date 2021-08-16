import logo from './logo.svg';
import './App.css';
import Board from "./components/Board";

function App() {
  console.log("e");
  return (
    <div className="App">
      <Board board_string={"050000002001000600968000004090010000015000940000900073100350090006001800000004000"}/>
    </div>
  );
}

export default App;

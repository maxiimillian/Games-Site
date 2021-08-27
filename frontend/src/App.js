import logo from './logo.svg';
import './App.css';
import Board from "./components/Board";
import { useCallback } from 'react';
import data from "./test.json";

function App() {
  console.log(data);
  return (
    <div className="App">
      <Board board_string={"050000002001000600968000004090010000015000940000900073100350090006001800000004000"} board_json={JSON.parse(data)}/>
    </div>
  );
}

export default App;

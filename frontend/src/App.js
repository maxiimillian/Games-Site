import logo from './logo.svg';
import './App.css';
import Board from "./components/Board";

function App() {
  return (
    <div className="App">
      <Board size={9}/>
    </div>
  );
}

export default App;

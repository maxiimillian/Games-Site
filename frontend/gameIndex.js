import SudokuForm from "./components/creationForms/SudokuForm";
import PokerForm from "./components/creationForms/PokerForm";
import ComingSoonForm from "./components/creationForms/ComingSoonForm";

const gameIndex = [
    {name: "Sudoku", imagePath: "/sudoku_board.png", render: () => <SudokuForm />},
    {name: "Poker", imagePath: "/poker.png", render: () => <ComingSoonForm />},
    {name: "Crossword", imagePath: "/sudoku_board.png", render: () => <ComingSoonForm />},
    {name: "Tic-Tac-Toe", imagePath: "/sudoku_board.png", render: () => <ComingSoonForm />},
    {name: "Blackjack", imagePath: "/sudoku_board.png", render: () => <ComingSoonForm />},
    {name: "Cluedo", imagePath: "/sudoku_board.png", render: () => <ComingSoonForm />},
]

export default gameIndex;
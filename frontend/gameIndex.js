import SudokuForm from "./components/creationForms/SudokuForm";
import PokerForm from "./components/creationForms/PokerForm";
import ComingSoonForm from "./components/creationForms/ComingSoonForm";

const gameIndex = [
    {name: "Sudoku", imagePath: "/sudoku_board.png", render: () => <SudokuForm />},
    {name: "Poker", imagePath: "/coming_soon.png", render: () => <ComingSoonForm />},
    {name: "Crossword", imagePath: "/coming_soon.png", render: () => <ComingSoonForm />},
    {name: "Tic-Tac-Toe", imagePath: "/coming_soon.png", render: () => <ComingSoonForm />},
    {name: "Blackjack", imagePath: "/coming_soon.png", render: () => <ComingSoonForm />},
    {name: "Cluedo", imagePath: "/coming_soon.png", render: () => <ComingSoonForm />},
]

export default gameIndex;
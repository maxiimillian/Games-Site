import SudokuForm from "./components/creationForms/SudokuForm";
import PokerForm from "./components/creationForms/PokerForm";
import ComingSoonForm from "./components/creationForms/ComingSoonForm";
import AdventForm from "./components/creationForms/AdventForm";

const gameIndex = [
    {name: "Sudoku", imagePath: "/coming_soon.png", render: () => <ComingSoonForm />},
    {name: "Advent", imagePath: "/advent.png", render: () => <AdventForm />},
    {name: "Poker", imagePath: "/coming_soon.png", render: () => <ComingSoonForm />},
    {name: "Crossword", imagePath: "/coming_soon.png", render: () => <ComingSoonForm />},
    {name: "Tic-Tac-Toe", imagePath: "/coming_soon.png", render: () => <ComingSoonForm />},
    {name: "Cluedo", imagePath: "/coming_soon.png", render: () => <ComingSoonForm />},
]

export default gameIndex;
import SudokuForm from "./components/creationForms/SudokuForm";
import PokerForm from "./components/creationForms/PokerForm";
import ComingSoonForm from "./components/creationForms/ComingSoonForm";
import AdventForm from "./components/creationForms/AdventForm";
import RedirectForm from "./components/creationForms/RedirectForm";
import CodexForm from "./components/creationForms/CodexForm";

const gameIndex = [
  {
    name: "Sudoku",
    imagePath: "/sudoku_board.png",
    render: () => <SudokuForm />,
  },
  {
    name: "Advent",
    imagePath: "/advent.png",
    render: () => <RedirectForm path={"/advent/"} />,
  },
  { name: "Codex", imagePath: "/codex.png", render: () => <CodexForm /> },
  {
    name: "Poker",
    imagePath: "/coming_soon.png",
    render: () => <ComingSoonForm />,
  },
  {
    name: "Tic-Tac-Toe",
    imagePath: "/coming_soon.png",
    render: () => <ComingSoonForm />,
  },
  {
    name: "Cluedo",
    imagePath: "/coming_soon.png",
    render: () => <ComingSoonForm />,
  },
];

export default gameIndex;

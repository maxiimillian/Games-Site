import Table from "./Table";
import Options from "./Options";
import Board from "./Board";
import { useState } from "react";
import data from "./test.json";

function CenterControl(props) {
    const VALID_OPTIONS = ["options", "poker", "sudoku"]
    const [option, setOption] = useState(props.option)
    let center;

    if (!VALID_OPTIONS.includes(option)) setOption("options");

    function changeOption(newOption) {
        if (VALID_OPTIONS.includes(newOption)) {
            setOption(newOption);
        }
    }
    
    if (option == "options") {
        center = <Options change_option={changeOption}/>
    } else if (option == "poker") {
        center = <Table />
    } else if (option == "sudoku") {
        center = <Board 
                board_string={"050000002001000600968000004090010000015000940000900073100350090006001800000004000"} 
                board_json={JSON.parse(data)}
                />
    }   

    return (
        <div>
            <button onClick={() => setOption("options")}>switch</button>
            {center}
        </div>
    )
}

export default CenterControl
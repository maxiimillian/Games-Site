


import { useCallback, useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import CenterControl from "./CenterControl";


//<Board board_string={"050000002001000600968000004090010000015000940000900073100350090006001800000004000"} board_json={JSON.parse(data)}/>
// Change this to a router for home, sudoku, and poker. When you go to /sudoku/:gameid it attempts to join with that game code. If its the host then show a waiting screen, if it
// errors show errors, if its open then put into waiting screen and change on the start call
function Home() {
    const [centerContent, setCenterContent] = useState("options");
    const [user, setUser] = useState({});




    return (
        <CenterControl option={centerContent} />
    )
  }
  
  export default Home;
  
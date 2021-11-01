import useAuth from "../../contexts/authContext";
import { useState, useEffect } from "react";

import Blockpage from "./Blockpage";
import Unauthenticated from '../Unauthenticated';

function Username(props) {
    
    let {user, error} = useAuth();
    const [showForm, setShowForm] = useState(false);
    useEffect(() => {
        console.log("UOOO", user);
    }, [user])
    return (
        <div className={`main-user-info ${props.className}`}>
            {showForm ? 
                <div>
                    <Blockpage handleClick={() => setShowForm(false)}>
                        
                    </Blockpage>
                    <Unauthenticated handleSubmit={(e) => console.log("e")}/>
                </div>    
                :
                null
            }
            {user.user ? 
                <div className="main-user-container">
                    <img className="main-user-profile" src={user.img_url}></img>
                    <h3 className="main-user-name">{user.user}</h3>
                </div>
                :
                <div className="main-user-container">
                    <h3 onClick={() => setShowForm(true)}>Sign In</h3>
                </div>
            }
        </div>
        )
}

export default Username;
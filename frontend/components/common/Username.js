import useAuth from "../../contexts/authContext";
import Blockpage from "../common/Blockpage";
import Unauthenticated from "../Unauthenticated";
import { useState, useEffect } from "react";

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
                    <Blockpage handleClick={() => setShowForm(false)} />

                    <Unauthenticated handleSubmit={(e) => console.log("e")}/>

                </div>    
                :
                null
            }
            {user ? 
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


/**
 *             {showForm ? 
                <div>
                    <Blockpage handleClick={() => setShowForm(false)} />

                    <Unauthenticated handleSubmit={(e) => console.log("e")}/>

                </div>    
                :
                null
            }
            {user.user ? 
                <div className={styles["main-user-container">"]} 
                    <img className={styles["main-user-profile" src={user.img_url}></img>"]} 
                    <h3 className={styles["main-user-name">{user.user}</h3>"]} 
                </div>
                :
                <div className={styles["main-user-container">"]} 
                    <h3 onClick={() => setShowForm(true)}>Sign In</h3>
                </div>
            }
 */
export default Username;
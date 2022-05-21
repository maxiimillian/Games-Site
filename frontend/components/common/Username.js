import useAuth from "../../contexts/authContext";
import { useState, useEffect } from "react";

function Username(props) {
    let {user, error} = useAuth();
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        console.log("UOOO", user);
    }, [user])
    return (
        <div className={`main-user-info ${props.className}`}>
            <h1>e</h1>
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
                <div className="main-user-container">
                    <img className="main-user-profile" src={user.img_url}></img>
                    <h3 className="main-user-name">{user.user}</h3>
                </div>
                :
                <div className="main-user-container">
                    <h3 onClick={() => setShowForm(true)}>Sign In</h3>
                </div>
            }
 */
export default Username;
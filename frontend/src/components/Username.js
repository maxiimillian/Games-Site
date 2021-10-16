import { userContext } from "../contexts/userContext";
import { useContext } from "react";

function Username(props) {
    let userCtx = useContext(userContext)

    return (
        <div className="main-user-info">
            {Object.keys(userCtx.user).length != 0 ? 
                <div className="main-user-container">
                    <img className="main-user-profile" src={userCtx.user.img_url}></img>
                    <h3 className="main-user-name">{userCtx.user.username}</h3>
                </div>
                :
                <div className="main-user-container">
                    <h3 onClick={props.handleSignin} >Sign In</h3>
                </div>
            }


        </div>
        )
}

export default Username;
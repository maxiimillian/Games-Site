import useAuth from "../../contexts/authContext";
import Blockpage from "../common/Blockpage";
import Unauthenticated from "../Unauthenticated";
import { useState, useEffect } from "react";

function Username(props) {
  let { user, error } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.user) {
        setUsername(user.user);
      }
    }
  }, [user]);

  return (
    <div className={`main-user-info ${props.className}`}>
      {showForm ? (
        <div>
          <Blockpage handleClick={() => setShowForm(false)} />

          <Unauthenticated handleSubmit={(e) => console.log("e")} />
        </div>
      ) : null}
      {username ? (
        <div className="main-user-container">
          <h3 className="main-user-name">{user.user}</h3>
        </div>
      ) : (
        <div className="main-user-container">
          <h3 onClick={() => setShowForm(true)}>Sign In</h3>
        </div>
      )}
    </div>
  );
}
export default Username;

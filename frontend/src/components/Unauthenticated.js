import { useState } from "react";
import "../styles/login.scss";
import useAuth from "../contexts/authContext";

function Unauthenticated({handleSubmit}) {
    const [username, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [mode, setMode] = useState("login");

    const {user, loading, error, login, register} = useAuth();

    var register_form = (
    <form className="login-form" onSubmit={(e) => { handleRegister(e) }}>
        <div style={{display: "flex"}}>
            <h1 style={{color: "white", fontSize: "1.3em"}}>Welcome, </h1>
            <h1 style={{color: "#9761a1", fontSize: "1.3em", fontWeight: "500"}}>&nbsp;Register.</h1>
        </div>

        <label>Username</label>
        <input className="form-input" type="text" name="username" value={username} onChange={(e) => setUser(e.target.value)}></input>

        <label>Password</label>
        <input className="form-input" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>


        <label>Confirm Password</label>
        <input className="form-input" type="password" name="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></input>

        <label>Email</label>
        <input className="form-input" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>

        <button className="form-submit" type="submit">Login</button>
        <em style={{color: "rgb(69, 98, 74)"}}>Have an account? <strong onClick={() => setMode("login")}>Login here</strong> </em>
    </form>
    )

    var login_form = (
        <form className="login-form" onSubmit={(e) => handleLogin(e)} method="post">
        <div style={{display: "flex"}}>
            <h1 style={{color: "white", fontSize: "1.3em"}}>Welcome, </h1>
            <h1 style={{color: "#9761a1", fontSize: "1.3em", fontWeight: "500"}}>&nbsp;Login.</h1>
        </div>

        <label>Username</label>
        <input className="form-input" type="text" name="username" value={username} onChange={(e) => setUser(e.target.value)}></input>

        <label>Password</label>
        <input className="form-input" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>

        <button className="form-submit" type="submit">Login</button>
        <em style={{color: "rgb(69, 98, 74)"}}>Don't have an account? <strong onClick={() => setMode("register")}>Register here</strong> </em>
    </form>
    )

    function handleLogin(e) {
        e.preventDefault();

        login(username, password);
    }

    function handleRegister(e) {
        e.preventDefault();

        register(username, password, email);
    }

    return (
        <div style={{zIndex: "99"}} className="login-form-container" >
                
            {mode == "login" ? 
                login_form :
                register_form    
            }
        </div>

    )
}

 export default Unauthenticated;
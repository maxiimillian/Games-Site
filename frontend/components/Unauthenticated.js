import { useState } from "react";
import styles from "../styles/login.module.scss";
import gameCreationStyles from "../styles/gamecreator.module.scss";
import useAuth from "../contexts/authContext";

function Unauthenticated({handleSubmit}) {
    const [username, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [mode, setMode] = useState("login");

    const {user, loading, error, login, register} = useAuth();

    var register_form = (
        <form className={styles["login-form"]} onSubmit={(e) => { handleRegister(e) }}>
            <div className={gameCreationStyles["create-form-header"]}>
                <h1 className={styles["form-header-text"]}>Welcome, </h1>
                <h1 className={`${styles["form-header-text"]} ${styles["highlight"]}`}>&nbsp;Register.</h1>
            </div>

            <div className={`${gameCreationStyles["create-form-center"]} ${gameCreationStyles["create-form-column"]}`}>
                <label>Username</label>
                <input className={styles["form-input"]} type="text" name="username" value={username} onChange={(e) => setUser(e.target.value)}></input>
            </div>

            <div className={`${gameCreationStyles["create-form-center"]} ${gameCreationStyles["create-form-column"]}`}>
                <label>Password</label>
                <input className={styles["form-input"]} type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            </div>

            <div className={`${gameCreationStyles["create-form-center"]} ${gameCreationStyles["create-form-column"]}`}>
                <label>Confirm Password</label>
                <input className={styles["form-input"]} type="password" name="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></input>
            </div>

            <div className={`${gameCreationStyles["create-form-center"]} ${gameCreationStyles["create-form-column"]}`}>
                <label>Email</label>
                <input className={styles["form-input"]} type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            </div>

            <button className={gameCreationStyles["create-form-submit"]} type="submit">Login</button>
            <em style={{color: "rgb(69, 98, 74)"}}>Have an account? <strong onClick={() => setMode("login")}>Login here</strong> </em>
        </form>
    )

    var login_form = (
        <form className={styles["login-form"]} onSubmit={(e) => handleLogin(e)} method="post">
        <div style={{display: "flex"}}>
            <h1 className={styles["form-header-text"]}>Welcome, </h1>
            <h1 className={`${styles["form-header-text"]} ${styles["highlight"]}`}>&nbsp;Login.</h1>
        </div>

        <label>Username</label>
        <input className={styles["form-input"]} type="text" name="username" value={username} onChange={(e) => setUser(e.target.value)}></input>

        <label>Password</label>
        <input className={styles["form-input"]} type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>

        <button className="submit" type="submit">Login</button>
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
        <div style={{zIndex: "99"}} className={styles["login-form-container"]} >
                
            {mode == "login" ? 
                login_form :
                register_form    
            }
        </div>

    )
}

 export default Unauthenticated;
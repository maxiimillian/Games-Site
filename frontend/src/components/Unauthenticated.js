import { useState } from "react";

function Unauthenticated({handleSubmit}) {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [mode, setMode] = useState("login");

    var register_form = (
    <form className="login-form" onSubmit={(e) => { handleRegister(e) }}>
        <div style={{display: "flex"}}>
            <h1 style={{color: "white", fontSize: "1.3em"}}>Welcome, </h1>
            <h1 style={{color: "#9761a1", fontSize: "1.3em", fontWeight: "500"}}>&nbsp;Register.</h1>
        </div>

        <label>Username</label>
        <input className="form-input" type="text" name="username" value={user} onChange={(e) => setUser(e.target.value)}></input>

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
        <input className="form-input" type="text" name="username" value={user} onChange={(e) => setUser(e.target.value)}></input>

        <label>Password</label>
        <input className="form-input" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>

        <button className="form-submit" type="submit">Login</button>
        <em style={{color: "rgb(69, 98, 74)"}}>Don't have an account? <strong onClick={() => setMode("register")}>Register here</strong> </em>
    </form>
    )

    async function handleLogin(e) {
        e.preventDefault();

        const response = await fetch("http://localhost:3001/auth/login", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"username": user, "password": password}),
        })
        .then(data => {
            return data.json();
        })
        .then(data => {
            console.log(data);
            localStorage.setItem("token", data.token);
        })
        .then(() => {
            handleSubmit();
        });

    }

    async function handleRegister(e) {
        e.preventDefault();
        console.log(user, password, email);
        const response = await fetch("http://localhost:3001/auth/register", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"username": user, "password": password, "email": email}),
        })
        .then(data => {
            return data.json()
        })
        .then(data => {
            localStorage.setItem("token", data.token);
        })
        .then(() => {
            handleSubmit();
        });
    }

    return (

        <div className="login-form-container" >
                
            {mode == "login" ? 
                login_form :
                register_form    
            }
        </div>

    )
}

 export default Unauthenticated;
import logo from "../public/logo.png";

function Loading() {
    return (
        <div style={{position: "absolute", margin: "10%"}}> 
            <img src={logo}></img>
        </div>
    )
}

export default Loading;
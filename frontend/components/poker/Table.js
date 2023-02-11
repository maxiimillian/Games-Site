import { React, useState, Component, useEffect } from "react";
import { io } from "socket.io-client";

export default function Table(props) {
  const [players, setPlayers] = useState([]);
  const [actions, setActions] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let socket_return = io(`${process.env.NEXT_PUBLIC_API_URL}/poker`, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });
    setSocket(socket_return);

    return () => {
      let test = socket_return.disconnect();
    };
  }, [setSocket]);

  return (
    <div>
      <div className="players-container">
        <button
          onClick={() => {
            socket.emit("create");
          }}
        >
          Click me
        </button>
      </div>
    </div>
  );
}

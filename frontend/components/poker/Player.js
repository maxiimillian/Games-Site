import { React, useState, Component, useEffect } from "react";

export default function Player(props) {
  return (
    <div>
      <span className="player-name">{props.name}</span>
      <div className="profile-container">
        <img src={props.profile}></img>
      </div>
      <div className="balance-container">
        <span className="player-balance">{props.balance}</span>
      </div>
      <div>
        <Hand cards={props.hand} />
      </div>
    </div>
  );
}

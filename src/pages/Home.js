import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomID] = useState("");
  const [userName, setUserName] = useState("");
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomID(id);
    toast.success("Created a new room");
  };
  const joinRoom = () => {
    if (!roomId || !userName) {
      toast.error("Room ID & User Name is required");
      return;
    }
    //redirect on editor
    navigate(`/editor/${roomId}`, {
      state: {
        userName,
      },
    });
  };

  const handInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <div className="logotext">
          <img className="homePageLogo" src="/vv.png" alt="" />
          <h1> Dragon Code </h1>{" "}
        </div>{" "}
        <h4 className="mainLabel"> Paste invitation ROOM ID </h4>{" "}
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="ROOM ID"
            value={roomId}
            onKeyUp={handInputEnter}
            onChange={(e) => setRoomID(e.target.value)}
          />{" "}
          <input
            type="text"
            className="inputBox"
            placeholder="USERNAME"
            value={userName}
            onKeyUp={handInputEnter}
            onChange={(e) => setUserName(e.target.value)}
          />{" "}
          <button className="btn joinBtn" onClick={joinRoom}>
            {" "}
            Join{" "}
          </button>{" "}
          <span className="createInfo">
            If you don 't have invite then create &nbsp;{" "}
            <a onClick={createNewRoom} href="https://" className="createNewBtn">
              new room{" "}
            </a>{" "}
          </span>{" "}
        </div>{" "}
      </div>{" "}
      <footer>
        <h4>
          Built by <a href="https://"> WildDragonDot </a>{" "}
        </h4>{" "}
      </footer>{" "}
    </div>
  );
};

export default Home;

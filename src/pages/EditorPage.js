import React, { useState, useRef, useEffect } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "./../socket";
import ACTIONS from "../Actions";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";

const EditorPage = () => {
  const reactNavigator = useNavigate();
  const codeRef = useRef(null);
  const socketRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later");
        reactNavigator("/");
      }
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        userName: location.state?.userName,
      });

      /* ----------------------- listening fronm join event ----------------------- */
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, userName, socketId }) => {
          if (userName !== location.state?.userName) {
            toast.success(`${userName} joined the room.`);
            console.log(`${userName} joined`);
          }
          setClients(clients);
          console.log(codeRef.current, "test");
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );
      /* ----------------------- listening for disconnected ----------------------- */
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, userName }) => {
        toast.success(`${userName} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  async function copyRoomID() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id has been copied to your clipboard");
    } catch (e) {
      toast.error("Could not copy the Room ID");
      console.log(e);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/vv.png" alt="editor logo" />
            <h1>Dragon Code</h1>
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client, index) => (
              <Client key={index} userName={client.userName} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomID}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(e) => {
            codeRef.current = e;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;

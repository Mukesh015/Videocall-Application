"use client";

import React, { useMemo, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = React.createContext("");

export const SocketProvider = ({ children }) => {
  const [socketId, setSocketId] = useState(null);
  const [toggoleVideo,setTogglevideo] = useState(false);

  const updateToggleVideo = async()=>{
    setTogglevideo(!toggoleVideo);
    console.log("Video toggled")
  }
  const updateSocketId = async (id) => {
    setSocketId(id);
    console.log("Socket ID updated");
  };
  const socket = useMemo(() => io(process.env.NEXT_PUBLIC_IO_DOMAIN), []);
  return (
    <SocketContext.Provider value={{ socket, updateSocketId,updateToggleVideo,toggoleVideo, socketId }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return React.useContext(SocketContext);
};

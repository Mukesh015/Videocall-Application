"use client"

import React, { useMemo,useState } from "react";
import { io } from "socket.io-client";

const SocketContext = React.createContext('');

export const SocketProvider = ({ children }) => {
  const [nego,setnego] = useState(false)
  const updateNego = async()=>{
    setnego(!nego);
    console.log("state updated")
  }
  const socket = useMemo(() => io(process.env.NEXT_PUBLIC_IO_DOMAIN), []);
  return (
    <SocketContext.Provider value={{socket,updateNego,nego}}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return React.useContext(SocketContext);
}
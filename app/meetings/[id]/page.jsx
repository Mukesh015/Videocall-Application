"use client";
import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@/components/provider/socket";



export default function Meetings({}) {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);

  const handleUserJoined = useCallback(({ email, id}) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, [remoteSocketId]);

  useEffect(()=>{
    socket.on('user-joined',handleUserJoined)
    return ()=>{
      socket.off('user-joined',handleUserJoined)
    }
  },[handleUserJoined,socket]);
  return (
    <>
    <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
    </>
  );
}

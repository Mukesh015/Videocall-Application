"use client";
import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@/components/provider/socket";
import peer from "@/components/provider/peer";

export default function Meetings({}) {
  const { socket,updateSocketId,toggoleVideo} = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  
  const handleUserJoined = useCallback(
    async ({ email, id }) => {
      console.log(`Email ${email} joined room ${id}`);

      const offer = await peer.getOffer();
      socket.emit("call-user", { to: id, offer });
      setRemoteSocketId(id);
      updateSocketId(id);
    },
    [remoteSocketId, socket,updateSocketId]
  );

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      setRemoteSocketId(from);
      updateSocketId(from);
      socket.emit("call-accepted", { to: from, ans });
    },
    [socket,updateSocketId]
  );
  const handleAcceptCall = useCallback(async ({ from, ans }) => {
    await peer.setLocalDescription(ans);
    console.log(`call got accepted`, from);
  }, []);
  useEffect(() => {
    socket.on("user-joined", handleUserJoined);
    socket.on("incomming-call", handleIncommingCall);
    socket.on("call-accepted", handleAcceptCall);
    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("incomming-call", handleIncommingCall);
      socket.off("call-accepted", handleAcceptCall);
    };
  }, [handleUserJoined, socket, handleIncommingCall, handleAcceptCall]);


  return (
    <>
      <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
    </>
  );
}

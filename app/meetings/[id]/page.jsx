"use client";
import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@/components/provider/socket";
import peer from "@/components/provider/peer";

export default function Meetings({}) {
  const { socket } = useSocket();

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const handleUserJoined = useCallback(
    async ({ email, id }) => {
      console.log(`Email ${email} joined room ${id}`);
      const offer = await peer.getOffer();
      socket.emit("call-user", { to: id, offer });
      setRemoteSocketId(id);
    },
    [remoteSocketId, socket]
  );

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      setRemoteSocketId(from);
      socket.emit("call-accepted", { to: from, ans });
    },
    [socket]
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

  const handleNegoNeeded = useCallback(async () => {
    const localoffer = await peer.getOffer();
    socket.emit("call-user", { offer: localoffer, to: remoteSocketId });
    console.log("Negotiation");
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  return (
    <>
      <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
    </>
  );
}

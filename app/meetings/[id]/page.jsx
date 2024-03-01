"use client";
import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@/components/provider/socket";
import PeerService from "@/components/provider/peer";

export default function Meetings({}) {
  const {socket,updateNego,nego} = useSocket();
  const Peerservice = new PeerService();
  const [remoteSocketId, setRemoteSocketId] = useState(null);

  const handleUserJoined = useCallback(
    async ({ email, id }) => {
      console.log(`Email ${email} joined room ${id}`);

      const offer = await Peerservice.getOffer();
      socket.emit("call-user", { to: id, offer });
      setRemoteSocketId(id);
    },
    [remoteSocketId, socket]
  );

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      console.log(`Incoming Call`, from, offer);
      const ans = await Peerservice.getAnswer(offer);
      setRemoteSocketId(from);
      socket.emit("call-accepted", { to: from, ans });
    },
    [socket]
  );
  const handleAcceptCall = useCallback(async ({ from, ans }) => {
    await Peerservice.setLocalDescription(ans);
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

  useEffect(() => {
    console.log(Peerservice.peer)
    if (Peerservice.peer) {
      Peerservice.peer.addEventListener("track", (event) => {
        if (event.track.kind === "video") {
          // Create a new video element
          const remoteVideo = document.createElement("video");
          remoteVideo.autoplay = true;
          remoteVideo.srcObject = new MediaStream([event.track]);

          // Append the video element to a container in the UI
          const videoContainer = document.getElementById(
            "remoteVideoContainer"
          );
          videoContainer.appendChild(remoteVideo);
        }
      });
    }
  }, [nego]);

  const handleNegoNeeded = useCallback(async () => {
    const offer = await PeerService.getOffer();
    socket.emit("peer-nego-needed", { offer, to: remoteSocketId });
    console.log("Negotiation")
  }, [remoteSocketId, socket]);

  
  useEffect(() => {
    Peerservice.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      Peerservice.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNego = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer-nego-done", { to: from, ans });
      console.log("Try to handle negotiation")
    },[socket])
    const handleNegoFinal = useCallback(async ({ ans }) => {
      await PeerService.setLocalDescription(ans);
      console.log("Negotiation Done");
    }, [socket])


useEffect(()=>{
  socket.on('peer-nego-needed',handleNego)
  socket.on('nego-final',handleNegoFinal)
  return ()=>{
        socket.off('peer-nego-needed',handleNego)
        socket.on('nego-final',handleNegoFinal)

      }
},[socket,handleNego,handleNegoFinal])
  return (
    <>
      <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
    </>
  );
}

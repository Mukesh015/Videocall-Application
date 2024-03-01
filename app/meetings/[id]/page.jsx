"use client";
import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@/components/provider/socket";
import PeerService from "@/components/provider/peer";

export default function Meetings({}) {
  const socket = useSocket();
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
    if (PeerService.peer) {
      PeerService.peer.addEventListener("track", (event) => {
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
  }, []);
  return (
    <>
      <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
    </>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/components/provider/socket";

export default function Home() {
  const router = useRouter();

  const { data: session } = useSession();
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [imgurl, setImgUrl] = useState(null);
  const [meetingCode, setMeetingCode] = useState("");
  const socket = useSocket();
  
  const newMeetingHost = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const fetchedId = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN}/api/generatesessionid`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await fetchedId.json();
        let sessionId = result.token;
        socket.emit("join-room", { email, roomId: sessionId });
      } catch (error) {
        console.log("failed to fetch session id server error", error);
      }
    },
    [ email]
  );
  const handleJoiningExistingRoom = useCallback(async (e) => {
    e.preventDefault();
    socket.emit("join-room", { email, roomId: meetingCode });
  }, [email,meetingCode]);
  
  const handleJoinRoom = useCallback(
    ({email,roomId}) => {

      console.log(email,roomId);
      router.push(`/meetings/${roomId}`)
    },
    [router]
  );
  useEffect(() => {
    if (
      session &&
      session.user &&
      session.user.image &&
      session.user.name &&
      session.user.email
    ) {
      setImgUrl(session.user.image);
      setName(session.user.name);
      setEmail(session.user.email);
    }
    socket.on("join-room", handleJoinRoom);
    return () => {
      socket.off("join-room", handleJoinRoom);
    };
  }, [session,socket,handleJoinRoom]);
  
  return (
    <>
      <div className="ml-20 flex">
        <div className="max-w-2xl w-full mt-44">
          <h1 className="text-5xl mb-5">
            Video calls and meetings for everyone
          </h1>
          <span className="text-lg">
            We provides secure, easy-to-use video calls and meetings for
            everyone, on any device.
          </span>
          <div className="mt-10 flex">
            <button
              onClick={newMeetingHost}
              type="button"
              className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 flex dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-3 text-center me-2 mb-2"
            >
              <svg
                className="mr-2 -ml-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
              </svg>
              New Meeting
            </button>
            <h1 className="ml-24 mr-24 pt-3 font-semibold text-blue-500">OR</h1>
            <input
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              type="text"
              id="search"
              className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block h-11 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white mr-3 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter a meeting link or code ..."
              required
            />
            <button
              onClick={handleJoiningExistingRoom}
              type="button"
              className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4  focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Join
            </button>
          </div>
        </div>
        <div className="mt-44 ml-12">
          <img
            className="h-80 rounded-lg"
            src="https://store.hp.com/app/assets/images/uploads/prod/how-to-use-google-meet1597872041079656.jpg"
            alt=""
          />
        </div>
      </div>
    </>
  );
}

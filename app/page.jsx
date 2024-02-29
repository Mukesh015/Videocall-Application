"use client";
import Link from "next/link";
import Image from "next/image";
import NextTopLoader from "nextjs-toploader";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import bubble from "../images/bubble.png";
import "./globals.css";

export default function Home() {
  const [typeEffect] = useTypewriter({
    words: [
      "Safe",
      "Secure",
      "Best video Quality",
      "No Third Party Interuption",
      "Admin Allowing",
      "Just One click",
      "Easy to use",
      "Chat services",
      "Send emojies and stickers",
      "No time limitations",
    ],
    loop: true,
    typeSpeed: 100,
    deleteSpeed: 50,
    Cursor: Cursor,
  });

  return (
    <>
      <NextTopLoader />
      <div className="relative overflow-hidden bg-center bg-cover size-full h-screen bg-[url('../images/background.png')]">
        <div className="text-white ml-32 absolute mt-32 z-10">
          <small className="font-bold text-xl">Welcome to our</small>
          <h1 className="text-7xl font-extrabold">Online Video Chat</h1>
          <p className="mt-40  text-xl font-semibold">
            We will provide a lot of services with
            <br />
            <span className="text-4xl font-extrabold">{typeEffect}</span>
          </p>
          <br />
          <div className="fixed bottom-40">
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-15 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                <Link href="/login">Sign in now</Link>
              </span>
            </button>
          </div>
        </div>

        <div
          id="sevenbubble"
          className="flex items-center justify-around absolute -bottom-40 w-full"
        >
          <Image
            className="bubble"
            src={bubble}
            alt="bubble"
            width={50}
            height={50}
          />
          <Image
            className="bubble"
            src={bubble}
            alt="bubble"
            width={50}
            height={50}
          />
          <Image
            className="bubble"
            src={bubble}
            alt="bubble"
            width={50}
            height={50}
          />
          <Image
            className="bubble"
            src={bubble}
            alt="bubble"
            width={50}
            height={50}
          />
          <Image
            className="bubble"
            src={bubble}
            alt="bubble"
            width={50}
            height={50}
          />
          <Image
            className="bubble"
            src={bubble}
            alt="bubble"
            width={50}
            height={50}
          />
          <Image
            className="bubble"
            src={bubble}
            alt="bubble"
            width={50}
            height={50}
          />
          <Image
            className="bubble"
            src={bubble}
            alt="bubble"
            width={50}
            height={50}
          />
        </div>
      </div>
    </>
  );
}

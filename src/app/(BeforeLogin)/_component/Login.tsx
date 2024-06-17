"use client";

import interviewImage from "../../../../public/interview.json";
import dynamic from "next/dynamic";
import Permission from "./Permission";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

export default function Login() {
  return (
    <div className="flex justify-center items-center flex-wrap">
      <div className="flex-col p-4">
        <p className="font-bold text-3xl my-10 pl-2">
          <span className="text-[#9EEAEA]">같이</span> 면접 준비하는 서비스 <br />
          같이 <span className="text-[#9EEAEA]">면접</span> <br />
        </p>
        <Permission />
      </div>
      <Lottie play animationData={interviewImage} className="m-8 md:m-20 md:w-1/3 md:h-1/3" />
    </div>
  );
}

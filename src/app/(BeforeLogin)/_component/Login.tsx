"use client";

import { Button } from "@/components/ui/button";
import interviewImage from "../../../../public/interview.json";
import dynamic from "next/dynamic";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { KAKAO_AUTH_URL } from "../_lib/kakao";
import { GOOGLE_AUTH_URL } from "../_lib/google";
import Permission from "./Permission";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

export default function Login() {
  return (
    <div className="flex justify-center items-center flex-wrap">
      <div className="flex-col mt-16">
        <p className="font-bold text-3xl my-10">
          <span className="text-[#9EEAEA]">같이</span> 면접 준비하는 서비스 <br />
          같이 <span className="text-[#9EEAEA]">면접</span> <br />
        </p>
        {/* <Link href={KAKAO_AUTH_URL}>
          <Button className="w-max-[350px] w-full h-[70px] rounded-full bg-[#FEE500] text-black text-xl">
            <RiKakaoTalkFill className="mr-2" />
            Kakao로 시작하기
          </Button>
        </Link>
        <Link href={GOOGLE_AUTH_URL}>
          <Button className="w-max-[350px] w-full h-[70px] rounded-full bg-[#FFFFFF] border border-slate-300 text-black text-xl mt-4">
            <FcGoogle className="mr-2" />
            Google로 시작하기
          </Button>
        </Link> */}

        <Permission link={KAKAO_AUTH_URL} />
        {/* <Permission link={GOOGLE_AUTH_URL} /> */}
      </div>
      <Lottie play animationData={interviewImage} className="m-20 w-1/3 h-1/3" />
    </div>
  );
}

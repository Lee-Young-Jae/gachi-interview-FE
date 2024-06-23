"use client";

import logo from "../../../../public/logo.json";
import landingL1 from "../../../../public/landingL1.json";
import landingL2 from "../../../../public/landingL2.json";
import landingL3 from "../../../../public/landingL3.json";
import landingL4 from "../../../../public/landingL4.json";
import dynamic from "next/dynamic";
import Permission from "./Permission";
import useIntersectionObserver from "../_lib/hooks/useIntersectionObserver";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

interface SubSectionProps {
  title?: string;
  lottieSrc: any;
  children: React.ReactNode;
}

const SubSection = ({ lottieSrc, children, title }: SubSectionProps) => {
  const [elementRef, inView] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`transition-opacity duration-1000 ease-in-out transform ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } flex flex-col items-start my-44`}
    >
      {title && <h2 className="text-2xl text-gray-800">{title}</h2>}
      <div className="flex justify-between items-center">
        <Lottie play animationData={lottieSrc} className="w-[70%] h-[90%] mr-4" />
        <p className="text-lg text-gray-700">{children}</p>
      </div>
    </div>
  );
};

export default function Login() {
  return (
    <>
      <div
        id="landing_root"
        className="relative flex flex-col md:flex-row justify-center items-center min-h-screen bg-gradient-to-r from-slate-100 to-white"
      >
        <div className="relative z-10 flex flex-col p-4 md:p-16 shadow-lg rounded-lg md:w-1/2 bg-white backdrop-blur-2xl bg-opacity-70">
          <div className="w-full h-dvh flex flex-col items-center">
            <span className="text-sm text-gray-800 w-full text-right">
              <a
                href="https://gachi-interview.notion.site/b445a6bbfa2142458be54beef487fecd?pvs=4"
                target="_blank"
                rel="noreferrer"
                className="text-blue-500"
              >
                같이 면접을 소개합니다 (notion)
              </a>
            </span>
            <h1 className="relative font-bold text-6xl text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mt-10">
              Gachi Interview
            </h1>
            <Lottie play animationData={logo} className="w-5/12" />

            <div className="sticky top-40">
              <p className="font-bold text-3xl text-gray-800 my-6 text-center">
                <span>같이 면접에 오신걸 환영해요!</span>
              </p>
              <Permission />
            </div>
          </div>
          <SubSection title="면접 준비 시작하기" lottieSrc={landingL1}>
            면접 가기 전 연습이 필요하신가요?
            <br />
            <sub>면접 질문을 통해 실전에 대비합니다.</sub>
          </SubSection>
          <SubSection title="왜 같이 면접인가요?" lottieSrc={landingL2}>
            실전에 대비한 면접 연습을 해보세요
            <br />
            <sub>같이 면접은 함께 면접을 준비하는 공간입니다.</sub>
            <br />
            <sub>면접을 공유하고 피드백을 받아보세요.</sub>
          </SubSection>
          <SubSection title="AI 면접 코칭" lottieSrc={landingL3}>
            AI 면접 코칭을 곁들인 면접 연습을 시작해보세요!
            <br />
            <sub>AI가 면접을 분석하고 피드백을 제공합니다.</sub>
            <br />
            <sub>피드백을 받고 더 나은 자신을 만나보세요.</sub>
          </SubSection>
          <SubSection title="언제. 어디서나" lottieSrc={landingL4}>
            시간과 장소에 상관없이 면접 연습을 지원합니다.
            <br />
            <sub>언제든지, 어디서든 장소에 구애받지 않고 면접 연습을 시작해보세요.</sub>
          </SubSection>
          <button
            className="w-full h-12 bg-primary text-white rounded-lg mt-4"
            onClick={() => {
              const welcome = document.getElementById("landing_root");
              welcome?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            서비스 시작하기↑
          </button>
        </div>
      </div>
    </>
  );
}

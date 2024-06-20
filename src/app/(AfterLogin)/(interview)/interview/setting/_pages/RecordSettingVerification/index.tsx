"use client";

import { useRouter } from "next/navigation";
import {
  interviewOptionState,
  mediaOptionState,
} from "@/app/(AfterLogin)/(interview)/_lib/atoms/interviewState";
import { useRecoilValue } from "recoil";
import { Suspense, useEffect, useState } from "react";
import { useErrorModal } from "@/components/Modal/useModal";
import Ready from "./_component/Ready";

interface RecordSettingVerificationProps {
  setStep: (step: number) => void;
}

const RecordSettingVerification = ({ setStep }: RecordSettingVerificationProps) => {
  const errorModal = useErrorModal();
  const router = useRouter();
  const interviewOption = useRecoilValue(interviewOptionState);
  const mediaOption = useRecoilValue(mediaOptionState);

  const messages = [
    { message: "면접장을 정리하고 있어요.", icon: "🧹" },
    { message: "AI를 잠에서 깨우고 있어요.", icon: "🤖" },
    { message: "면접 AI를 충전시키는 중...", icon: "🔌" },
    { message: "인코딩 서버를 부팅 중...", icon: "🚀" },
    { message: "곧 면접을 시작할게요!", icon: "🎥" },
    { message: "그럴싸해보이는 답변을 생각 중...", icon: "💡" },
    { message: "녹음이 잘 되도록 스탠딩 마이크를 설치 중...", icon: "🎤" },
    { message: "AI를 면접관으로 학습중...", icon: "🔍" },
    // { message: "그거 아시나요? 면접 AI는 무한한 인내심을 가지고 있어요.", icon: "🤫" },
    { message: "질문을 상세하게 분석 중...", icon: "🔍" },
    { message: "그거 아시나요? 질문을 상세히 작성할수록 면접 AI가 더 똑똑해져요.", icon: "🧠" },
    { message: "저희 서비스는 면접 퀄리티를 위해 녹화시간을 5분으로 제한하고 있어요.", icon: "⏱" },
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(
    Math.floor(Math.random() * messages.length),
  );
  const [fadeIn, setFadeIn] = useState(true);

  const validateInterviewOption = () => {
    if (!interviewOption) {
      setStep(1);
      return false;
    }

    if (!interviewOption.questions.length) {
      errorModal("질문을 먼저 선택해주세요.");
      setStep(1);
      return false;
    }

    if (!mediaOption.media) {
      errorModal("녹화를 위한 미디어를 설정해주세요.");
      setStep(2);
      return false;
    }

    return true;
  };

  useEffect(() => {
    const LOADING_TIME = 4000;

    if (!validateInterviewOption()) {
      return;
    }

    const changeMessage = () => {
      setFadeIn(false);
      const nextMessageIndex = (currentMessageIndex + 1) % messages.length;
      setTimeout(() => {
        setCurrentMessageIndex(nextMessageIndex);
        setFadeIn(true);
      }, 1000);
    };

    const timer = setTimeout(() => {
      router.push("/interview/record");
    }, LOADING_TIME);

    const messageTimer = setInterval(changeMessage, LOADING_TIME / 2); // 횟수 조절

    return () => {
      clearTimeout(timer);
      clearInterval(messageTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full justify-center p-8">
      <Suspense fallback={<span className="loader" />}>
        <Ready />
      </Suspense>
      <div
        className={`text-xl font-semibold message h-16 mt-2 ${
          fadeIn ? "animate-fadeIn" : "animate-fadeOut"
        }`}
      >
        {messages[currentMessageIndex].message}
      </div>
    </div>
  );
};

export default RecordSettingVerification;

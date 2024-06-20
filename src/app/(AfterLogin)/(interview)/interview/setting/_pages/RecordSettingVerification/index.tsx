"use client";

import { useRouter } from "next/navigation";
import {
  interviewOptionState,
  mediaOptionState,
} from "@/app/(AfterLogin)/(interview)/_lib/atoms/interviewState";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { useErrorModal } from "@/components/Modal/useModal";

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
    { message: "면접 AI에 충전기 꼽는 중...", icon: "🔌" },
    { message: "인코딩 서버를 부팅 중...", icon: "🚀" },
    { message: "곧 면접을 시작할게요!", icon: "🎥" },
    { message: "그럴싸해보이는 답변을 생각 중...", icon: "💡" },
    { message: "녹음이 잘 되도록 준비 중...", icon: "🎙️" },
    { message: "면접 AI가 면접관을 찾는 중...", icon: "🔍" },
  ];

  const randomIndex = Math.floor(Math.random() * messages.length);

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
    const LOADING_TIME = 700;

    if (!validateInterviewOption()) {
      return;
    }

    const timer = setTimeout(() => {
      router.push("/interview/record");
    }, LOADING_TIME);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-96 justify-center">
      <span className="loader" />
      <div className="text-xl font-semibold mt-32 message h-16">
        {messages[randomIndex].message}
      </div>
    </div>
  );
};

export default RecordSettingVerification;

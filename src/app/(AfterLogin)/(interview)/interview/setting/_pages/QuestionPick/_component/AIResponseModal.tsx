import dynamic from "next/dynamic";
import ready from "../../../../../../../../../public/CreateQuestionAIL.json";
import { Suspense, useEffect, useState } from "react";
import Modal from "@/components/Modal";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

const Ready = () => {
  return (
    <div className="flex items-center justify-center w-full h-full overflow-hidden">
      <Lottie play animationData={ready} className="object-scale-down max-h-96" />
    </div>
  );
};

// 로딩이 완료될때까지 랜덤 메시지를 보여준다.
interface AIResponseModalProps {
  disableBackdropClick?: boolean;
  job: {
    name: string;
    MajorCategory: string;
  };
}

const AIResponseModal = ({ job }: AIResponseModalProps) => {
  const messages = [
    { message: "세상에 있는 모든 질문지를 살펴보는 중...", icon: "🔍" },
    { message: "곧 준비됩니다...!", icon: "🎥" },
    { message: "새 A4용지를 꺼내는 중...", icon: "📄" },
    { message: "만족스러운 답변을 작성하는 중...", icon: "💡" },
    { message: "AI를 면접관으로 훈련시키는 중...", icon: "🔍" },
    { message: `AI를 ${job.name} 전문가로 학습시키는 중...`, icon: "🔍" },
    { message: "AI가 멋진 답변을 만들어 내는 중이에요...", icon: "💡" },
    { message: "불편한 점이 있으신가요? 피드백을 남겨주세요!", icon: "📝" },
    { message: `${job.MajorCategory} 관계자로부터 질문을 받아오는 중...`, icon: "🔍" },
    { message: `${job.name} 직무에 대한 질문을 준비하는 중...`, icon: "🔍" },
    { message: `${job.name}에 대한 정보를 찾는 중...`, icon: "🔍" },
    { message: `${job.name}을 구글에 검색해보는 중...`, icon: "🔍" },
    { message: `${job.name} 관련 리포트를 읽어보는 중...`, icon: "🔍" },
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(
    Math.floor(Math.random() * messages.length),
  );
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const LOADING_TIME = 2000; // 1.5초

    const changeMessage = () => {
      setFadeIn(false);
      const nextMessageIndex = (currentMessageIndex + 1) % messages.length;
      setTimeout(() => {
        setCurrentMessageIndex(nextMessageIndex);
        setFadeIn(true);
      }, 1000);
    };

    const messageTimer = setInterval(changeMessage, LOADING_TIME);
    return () => {
      clearInterval(messageTimer);
    };
  }, []);

  return (
    <Modal>
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
    </Modal>
  );
};

export default AIResponseModal;

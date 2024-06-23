"use client";

import { useState } from "react";
import QuestionPick from "./_pages/QuestionPick";
import RecordSetting from "./_pages/RecordSetting";
import RecordSettingVerification from "./_pages/RecordSettingVerification";
import Footer from "./_pages/_component/footer";

const Progress = ({ step }: { step: number }) => {
  const MAX_STEP = 3;

  const subTitles = ["질문 선택", "미디어 설정", "녹화 준비"];

  return (
    <div className="flex justify-center items-center flex-wrap trnsition-all duration-300 mb-4">
      {Array.from({ length: MAX_STEP }).map((_, index) => (
        <div key={index} className="flex flex-row items-center">
          <div
            key={index}
            className={`flex flex-col items-center mx-1 md:mx-4 ${
              step >= index + 1 ? "text-blue-600" : "text-gray-400"
            } ${step === index + 1 ? "font-bold" : "font-normal"}
            `}
          >
            <span className="text-sm font-bold">{index + 1}</span>
            <span className="text-xs">{subTitles[index]}</span>
          </div>
          {index !== MAX_STEP - 1 && (
            <div
              className={`flex items-center mx-2 md:mx-4 ${
                step > index + 1 ? "bg-blue-600" : "bg-gray-400"
              } h-0.5 w-8 md:w-10 rounded-full`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

const SettingPage = () => {
  const [step, setStep] = useState(1);

  return (
    // TODO: 매직 넘버를 상수로 변경
    <div>
      <Progress step={step} />
      {step === 1 && <QuestionPick />}
      {step === 2 && <RecordSetting />}
      {step === 3 && <RecordSettingVerification setStep={setStep} />}
      <Footer setStep={setStep} step={step} />
    </div>
  );
};

export default SettingPage;

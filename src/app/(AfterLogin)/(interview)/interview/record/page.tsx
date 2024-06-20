"use client";

import { useEffect, useState } from "react";
import { QuestionViewer, AnswerViewer } from "./_component/Viewer";
import Timer from "./_component/Timer";
import Controller from "./_component/Controller";
import useRecord from "./_lib/hook/useRecord";
import { useRecoilValue } from "recoil";
import { mediaOptionState } from "../../_lib/atoms/interviewState";
import Transcript from "./_component/Transcript";

const RecordPage = () => {
  const [script, setScript] = useState<{
    questionId: number;
    showAnswer: boolean;
  }>({ questionId: 0, showAnswer: false });

  const {
    questionList,
    startRecordHandler,
    stopRecordHandler,
    time,
    videoRef,
    isRecording,
    transcript,
  } = useRecord();

  const mediaOption = useRecoilValue(mediaOptionState);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = mediaOption.media;
    }

    if (mediaOption.media) {
      mediaOption.media.getVideoTracks().forEach((track) => {
        track.onended = () => {
          stopRecordHandler();
        };
      });
    }
  }, [mediaOption.media]);

  return (
    <div>
      <div className="relative bg-black h-screen">
        <QuestionViewer
          questionId={script.questionId}
          questionList={questionList}
          timer={<Timer seconds={time} />}
        />
        <div className="w-full h-full m-auto object-contain bg-transparent">
          <video
            className="display-block scale-x-[-1] object-cover m-auto block w-full h-full"
            ref={videoRef}
            autoPlay
            muted
            playsInline
          />
        </div>
        {script.showAnswer && (
          <AnswerViewer questionId={script.questionId} questionList={questionList} />
        )}
        {!script.showAnswer && transcript && <Transcript transcript={transcript} />}
        <Controller
          isRecording={isRecording}
          setScript={setScript}
          onStartRecord={startRecordHandler}
          onStopRecord={stopRecordHandler}
          questionList={questionList}
          currentQuestionId={script.questionId}
        />
      </div>
    </div>
  );
};

export default RecordPage;

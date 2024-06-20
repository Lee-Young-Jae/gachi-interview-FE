import { Dispatch, useEffect } from "react";
import { QuestionType } from "../../../_lib/atoms/interviewState";
import { useModal } from "@/components/Modal/useModal";
import { useRouter } from "next/navigation";
import {
  BsCardText,
  BsXLg,
  BsLayoutTextSidebarReverse,
  BsCameraVideo,
  BsCameraVideoOff,
  BsFillCaretLeftFill,
  BsFillCaretRightFill,
} from "react-icons/bs";

interface ControllerProps {
  setScript: Dispatch<
    React.SetStateAction<{
      questionId: number;
      showAnswer: boolean;
    }>
  >;
  onStartRecord: () => void;
  onStopRecord: () => void;
  questionList: QuestionType[];
  currentQuestionId: number;
  isRecording: boolean;
}

const Controller = ({
  setScript,
  onStartRecord,
  onStopRecord,
  questionList,
  currentQuestionId,
  isRecording,
}: ControllerProps) => {
  const { openDialog } = useModal();
  const router = useRouter();

  const startRecordHandler = () => {
    onStartRecord();
  };

  const stopRecordHandler = () => {
    onStopRecord();
  };

  const toggleShowAnswerHandler = () => {
    setScript((prev) => ({ ...prev, showAnswer: !prev.showAnswer }));
  };

  const prevQuestionHandler = () => {
    if (!questionList) return;
    if (questionList[0]?.questionId === currentQuestionId) {
      openDialog("첫 번째 질문입니다.");
      return;
    }

    const currentIdx = questionList.findIndex(
      (question) => question.questionId === currentQuestionId,
    );
    const prevIdx = currentIdx - 1;
    setScript({
      questionId: questionList[prevIdx].questionId,
      showAnswer: false,
    });
  };

  const nextQuestionHandler = () => {
    if (!questionList) return;
    if (questionList.at(-1)?.questionId === currentQuestionId) {
      openDialog("마지막 질문입니다.");
      return;
    }

    const currentIdx = questionList.findIndex(
      (question) => question.questionId === currentQuestionId,
    );
    const nextIdx = currentIdx + 1;
    setScript({
      questionId: questionList[nextIdx].questionId,
      showAnswer: false,
    });
  };

  useEffect(() => {
    if (questionList.length > 0) {
      setScript({
        questionId: questionList[0].questionId,
        showAnswer: false,
      });
    } else {
      router.push("/");
    }
  }, [questionList, setScript, router]);

  return (
    <div className="fixed bottom-0 flex m-auto w-full justify-center gap-8 p-4 bg-opacity-70 text-white bg-black z-10 select-none">
      <div className="cursor-pointer flex flex-col" onClick={() => router.push("/")}>
        <BsXLg size="30" color="#fff" className="m-auto" />
        <span className="text-xs text-center mt-1">나가기</span>
      </div>
      <div className="cursor-pointer flex flex-col" onClick={toggleShowAnswerHandler}>
        <BsLayoutTextSidebarReverse size="30" color="#fff" className="m-auto" />
        <span className="text-xs text-center mt-1">답변 보기</span>
      </div>

      {isRecording ? (
        <div className="flex flex-col">
          <div
            className="cursor-pointer flex flex-col bg-red-700 rounded-full p-5 shadow-red-400 shadow-inner hover:bg-red-800 transition-all"
            onClick={stopRecordHandler}
          >
            <BsCameraVideoOff size="30" color="#fff" className="m-auto" />
            <span className="text-xs text-center mt-1 text-red-500">녹화 종료</span>
          </div>
        </div>
      ) : (
        <>
          <div>
            <div className="flex flex-col">
              <div
                className="cursor-pointer flex flex-col bg-blue-700 rounded-full p-5 shadow-blue-400 shadow-inner hover:bg-blue-800 transition-all"
                onClick={startRecordHandler}
              >
                <BsCameraVideo size="30" color="#fff" className="m-auto" />
              </div>
              <span className="text-xs text-center mt-1">시작</span>
            </div>
          </div>
        </>
      )}
      <div className="cursor-pointer flex flex-col" onClick={prevQuestionHandler}>
        <BsFillCaretLeftFill size="30" color="#fff" className="m-auto" />
        <span className="text-xs text-center mt-1">이전 질문</span>
      </div>
      <div className="cursor-pointer flex flex-col" onClick={nextQuestionHandler}>
        <BsFillCaretRightFill size="30" color="#fff" className="m-auto" />
        <span className="text-xs text-center mt-1">다음 질문</span>
      </div>
    </div>
  );
};

export default Controller;

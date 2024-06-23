import { useModal } from "@/components/Modal/useModal";
import {
  useGetWorkbookListQuery,
  usePostWorkbookMutation,
} from "../../../_lib/queries/useWorkbookListQuery";
import AddQuestionTitleModal from "./AddQuestionTitleModal";
import { useRecoilValue } from "recoil";
import { userIdState } from "@/store/auth";
import { Suspense, useEffect } from "react";
import Modal from "@/components/Modal";
import dynamic from "next/dynamic";
import vacation from "../../../../../../../../../public/vacationL.json";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

export const Vacation = () => {
  return (
    <div className="flex items-center justify-center w-full h-3/4 overflow-hidden">
      <Lottie play animationData={vacation} className="object-scale-down w-3/4" />
    </div>
  );
};

interface SelectWorkbookSectionProps {
  selectedWorkbookId: number | null;
  setSelectedWorkbookId: (id: number) => void;
}

const SelectWorkbookSection = ({
  selectedWorkbookId,
  setSelectedWorkbookId,
}: SelectWorkbookSectionProps) => {
  const { data: questionList } = useGetWorkbookListQuery();
  const { mutate: createTitleMutate, isSuccess, data } = usePostWorkbookMutation();
  const { openModal, closeModal } = useModal();
  const userId = useRecoilValue(userIdState);

  const openAddTitleModalHandler = () => {
    const submitHandler = ({ title, job }: { title: string; job: string }) => {
      createTitleMutate({ userId, title, job });
    };

    openModal(<AddQuestionTitleModal disableBackdropClick onSubmit={submitHandler} />);
  };

  useEffect(() => {
    if (data?.status === 429) {
      openModal(
        <Modal
          header="질문지 생성 실패 - 휴식 중인 AI"
          footer={
            <button className="btn btn-primary" onClick={closeModal}>
              확인
            </button>
          }
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center w-full h-full overflow-hidden">
                휴식 중인 AI를 불러오는 중...
              </div>
            }
          >
            <Vacation />
          </Suspense>
          <p>같이면접 질문/답변 AI가 잠시 휴식중이에요... 😅</p> <br />
          <p>아쉽지만 내일 다시 요청해주시면 더 좋은 결과를 보내드릴게요!</p>
        </Modal>,
      );
      return;
    }

    if (isSuccess) {
      closeModal();
    }
  }, [isSuccess, data]);

  //TODO: Popover로 워크북 삭제 기능 추가
  return (
    <ul>
      {questionList &&
        questionList.map((question) => (
          <li
            key={question.listId}
            className={`${
              selectedWorkbookId === question.listId && "bg-muted justify-start"
            } flex-col items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 justify-start cursor-pointer`}
            onClick={() => setSelectedWorkbookId(question.listId)}
          >
            {question.title}
          </li>
        ))}
      <li
        onClick={openAddTitleModalHandler}
        className="flex-col items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors h-9 px-4 py-2 justify-start cursor-pointer text-blue-600 hover:bg-muted hover:text-primary disabled:pointer-events-none disabled:opacity-50"
      >
        + 새 질문지를 만들게요.
      </li>
    </ul>
  );
};

export default SelectWorkbookSection;

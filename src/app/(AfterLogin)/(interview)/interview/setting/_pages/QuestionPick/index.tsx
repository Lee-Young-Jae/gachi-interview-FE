"use client";

import { Suspense, useEffect, useState } from "react";
import SelectQuestionSection from "./_component/SelectQuestionSection";
import {
  useGetWorkbookListQuery,
  usePostWorkbookMutation,
} from "../../_lib/queries/useWorkbookListQuery";
import SelectWorkbookSection, { Vacation } from "./_component/SelectWorkbookSection";
import AddQuestionTitleModal from "./_component/AddQuestionTitleModal";
import { useModal } from "@/components/Modal/useModal";
import { useRecoilValue } from "recoil";
import { userIdState } from "@/store/auth";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { useGetQuestionsQuery } from "../../_lib/queries/useQuestions";

const QuestionPick = () => {
  return <WorkbookList />;
};

export default QuestionPick;

// 생성 실패 모달
const CreateWorkbookFailModal = ({ onClose }: { onClose: () => void }) => (
  <Modal
    header="질문지 생성 실패 - 휴식 중인 AI"
    footer={
      <button className="btn btn-primary" onClick={onClose}>
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
    <sub>직접 질문/답변을 입력하시는 건 언제든 가능해요!!</sub>
  </Modal>
);

const WorkbookList = () => {
  const [selectedWorkbookId, setSelectedWorkbookId] = useState<number | null>(null);

  const { data: workbookList } = useGetWorkbookListQuery();
  const { data: questionList } = useGetQuestionsQuery({
    workbookId: selectedWorkbookId,
  });

  const { mutate: createTitleMutate, isSuccess, data: createTitleData } = usePostWorkbookMutation();
  const userId = useRecoilValue(userIdState);

  const { closeModal, openModal } = useModal();

  const handleClickWorkbookTitle = (id: number) => {
    setSelectedWorkbookId(id);
  };

  // 워크북 리스트가 있으면 마지막 워크북으로 설정
  useEffect(() => {
    if (workbookList) {
      setSelectedWorkbookId(workbookList.at(-1)?.listId || null);
    }
  }, [workbookList]);

  useEffect(() => {
    if (createTitleData?.status === 429) {
      openModal(<CreateWorkbookFailModal onClose={closeModal} />);
      return;
    }
    if (isSuccess) {
      closeModal();
    }
  }, [isSuccess, createTitleData]);

  const submitHandler = ({ title, job }: { title: string; job: string }) => {
    createTitleMutate({ userId, title, job });
  };

  const openAddTitleModalHandler = () => {
    openModal(<AddQuestionTitleModal disableBackdropClick onSubmit={submitHandler} />);
  };

  if (!workbookList) return null;
  if (workbookList.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full overflow-hidden relative">
        <AddQuestionTitleModal disableBackdropClick onSubmit={submitHandler} />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row">
      {/* 워크북 리스트 */}
      <div className="flex flex-col">
        {workbookList?.map(({ listId, title }) => {
          const isSelected = selectedWorkbookId === listId;
          return (
            <Button
              key={listId}
              variant="outline"
              className={`w-full border-none justify-start ${isSelected ? "bg-muted" : ""}`}
              onClick={() => handleClickWorkbookTitle(listId)}
            >
              {title}
            </Button>
          );
        })}
        <Button
          variant="outline"
          className="text-blue-600 border-none justify-start hover:text-blue-600"
          onClick={openAddTitleModalHandler}
        >
          + 새 질문지를 만들게요.
        </Button>
      </div>
      {/* 질문 리스트 */}
      <SelectQuestionSection
        workbookId={selectedWorkbookId}
        questionTitle={
          workbookList.find((workbook) => workbook.listId === selectedWorkbookId)?.title || ""
        }
      />
    </div>
  );
};

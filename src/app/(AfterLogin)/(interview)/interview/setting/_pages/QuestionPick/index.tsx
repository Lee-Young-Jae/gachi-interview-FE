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

const QuestionPick = () => {
  const { data: questionList } = useGetWorkbookListQuery();
  const [selectedWorkbookId, setSelectedWorkbookId] = useState<number | null>(
    questionList?.at(-1)?.listId || null,
  );
  const userId = useRecoilValue(userIdState);

  const { mutate: createTitleMutate, isSuccess, data } = usePostWorkbookMutation();
  const { closeModal, openModal } = useModal();

  useEffect(() => {
    if (questionList?.at(-1)?.listId)
      setSelectedWorkbookId(questionList[questionList.length - 1].listId);
  }, [questionList]);

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
          <sub>직접 질문/답변을 입력하시는 건 언제든 가능해요!!</sub>
        </Modal>,
      );
      return;
    }

    if (isSuccess) {
      closeModal();
    }
  }, [isSuccess, data]);

  if (!questionList) return null;

  const submitHandler = ({ title, job }: { title: string; job: string }) => {
    createTitleMutate({ userId, title, job });
  };

  if (questionList.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full overflow-hidden relative">
        <AddQuestionTitleModal disableBackdropClick onSubmit={submitHandler} />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row">
      <SelectWorkbookSection
        selectedWorkbookId={selectedWorkbookId}
        setSelectedWorkbookId={setSelectedWorkbookId}
      />
      <SelectQuestionSection
        workbookId={selectedWorkbookId}
        questionTitle={
          questionList.find((question) => question.listId === selectedWorkbookId)?.title || ""
        }
      />
    </div>
  );
};

export default QuestionPick;

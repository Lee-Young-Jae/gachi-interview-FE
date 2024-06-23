"use client";

import { useEffect, useState } from "react";
import SelectQuestionSection from "./_component/SelectQuestionSection";
import {
  useGetWorkbookListQuery,
  usePostWorkbookMutation,
} from "../../_lib/queries/useWorkbookListQuery";
import SelectWorkbookSection from "./_component/SelectWorkbookSection";
import AddQuestionTitleModal from "./_component/AddQuestionTitleModal";
import { useModal } from "@/components/Modal/useModal";
import { useRecoilValue } from "recoil";
import { userIdState } from "@/store/auth";

const QuestionPick = () => {
  const { data: questionList } = useGetWorkbookListQuery();
  const [selectedWorkbookId, setSelectedWorkbookId] = useState<number | null>(
    questionList?.at(-1)?.listId || null,
  );
  const userId = useRecoilValue(userIdState);

  const { mutate: createTitleMutate, isSuccess } = usePostWorkbookMutation();
  const { closeModal } = useModal();

  useEffect(() => {
    if (questionList?.at(-1)?.listId)
      setSelectedWorkbookId(questionList[questionList.length - 1].listId);
  }, [questionList]);

  if (!questionList) return null;

  const submitHandler = ({ title, job }: { title: string; job: string }) => {
    createTitleMutate({ userId, title, job });
    isSuccess && closeModal();
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

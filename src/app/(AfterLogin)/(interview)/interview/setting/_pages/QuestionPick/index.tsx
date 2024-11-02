"use client";

import { useEffect, useState } from "react";
import {
  useDeleteWorkbookMutation,
  useGetWorkbookListQuery,
  usePostWorkbookMutation,
} from "../../_lib/queries/useWorkbookListQuery";
import AddQuestionTitleModal from "./_component/Modals/AddQuestionTitleModal";
import { useModal } from "@/components/Modal/useModal";
import { useRecoilState, useRecoilValue } from "recoil";
import { userIdState } from "@/store/auth";
import { Button } from "@/components/ui/button";
import {
  useDeleteQuestionMutation,
  useGetQuestionsQuery,
  usePostQuestionsMutation,
} from "../../_lib/queries/useQuestions";
import Loading from "@/app/(AfterLogin)/_component/Loading";
import { interviewOptionState } from "@/app/(AfterLogin)/(interview)/_lib/atoms/interviewState";
import AddQuestionModal from "./_component/Modals/AddQuestionModal";
import DeleteDialog from "./_component/Modals/DeleteDialog";
import CreateWorkbookFailModal from "./_component/Modals/CreateWorkbookFailModal";
import QuestionItem from "./_component/QuestionItem";

const QuestionPick = () => {
  return <WorkbookList />;
};

export default QuestionPick;

const WorkbookList = () => {
  const [selectedWorkbookId, setSelectedWorkbookId] = useState<number | null>(null);

  const { data: workbookList, isLoading: workbookListLoading } = useGetWorkbookListQuery();
  const { data: questionList, isLoading: questionListLoading } = useGetQuestionsQuery({
    workbookId: selectedWorkbookId,
  });

  const { mutate: createTitleMutate, isSuccess, data: createTitleData } = usePostWorkbookMutation();
  const { mutate: createQuestionMutate } = usePostQuestionsMutation();
  const { mutate: deleteWorkbookMutate } = useDeleteWorkbookMutation();
  const { mutate: deleteQuestionMutate } = useDeleteQuestionMutation();

  const userId = useRecoilValue(userIdState);
  const [{ questions: selectedQuestions }, setInterviewOption] =
    useRecoilState(interviewOptionState);
  const { closeModal, openModal } = useModal();

  const handleClickWorkbookTitle = (id: number) => {
    setSelectedWorkbookId(id);
    // 질문 선택 초기화
    setInterviewOption((prev) => ({
      ...prev,
      questions: [],
    }));
  };

  // 워크북 리스트가 있으면 마지막 워크북으로 설정
  useEffect(() => {
    if (workbookList) {
      setSelectedWorkbookId(workbookList.at(-1)?.listId || null);
    }
  }, [workbookList]);

  // 워크북 생성 실패 모달 (AI 한도 초과시 발생) (하드코딩 개선 필요, 공용 에러처리로 빼는게 좋을듯?)
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

  const openAddQuestionModalHandler = () => {
    if (!selectedWorkbookId) return;

    openModal(
      <AddQuestionModal
        disableBackdropClick={true}
        closeModal={closeModal}
        onSubmit={(questionContent, answerContent) => {
          createQuestionMutate({
            userId,
            questionContent,
            answerContent,
            workbookId: selectedWorkbookId,
          });
          closeModal();
        }}
      />,
    );
  };

  if (!workbookList) return null;
  if (workbookList.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full overflow-hidden relative">
        <AddQuestionTitleModal disableBackdropClick onSubmit={submitHandler} />
      </div>
    );
  }

  const handleCheckAll = () => {
    if (!questionList) return;

    const currentQuestionListIds = questionList?.map((question) => question.questionId);

    // 하나라도 체크되어 있는지 여부
    const existChecked = selectedQuestions.some((question) =>
      currentQuestionListIds?.includes(question.questionId),
    );
    const nextQuestions = existChecked ? [] : questionList;
    setInterviewOption((prev) => ({
      ...prev,
      questions: nextQuestions,
    }));
  };
  const handleCheckOne = (targetId: number) => {
    const existChecked = selectedQuestions.some((question) => question.questionId === targetId);
    const targetQuestion = questionList?.find((question) => question.questionId === targetId);

    // 원래 로직에서는 질문을 선택할때, 다른 워크북의 질문이 존재한다면, 모두 삭제하고 새로 선택한 질문만 추가하는 로직이었음. (안전 장치 존재)
    // 하지만 이번에는 다른 워크북의 질문이 존재해도 그대로 유지하는 로직으로 변경함. (이 로직은 워크북을 바꿀 때, 질문들 reset을 하도록 변경: 함수 handleClickWorkbookTitle)
    if (!targetQuestion) return;
    const nextQuestions = existChecked
      ? selectedQuestions.filter((question) => question.questionId !== targetId)
      : [...selectedQuestions, targetQuestion];
    setInterviewOption((prev) => ({
      ...prev,
      questions: nextQuestions,
    }));
  };

  const openWorkbookDeleteModal = () => {
    if (!selectedWorkbookId) return;

    const handleDelete = () => {
      deleteWorkbookMutate({
        userId,
        workbookId: selectedWorkbookId,
      });

      closeModal();
    };

    openModal(
      <DeleteDialog
        title="질문지 삭제"
        message={
          <>
            <p>선택한 질문지를 삭제할까요? </p>
            <sub>포함된 질문들도 함께 삭제됩니다.</sub>
          </>
        }
        onClose={closeModal}
        onDelete={handleDelete}
      />,
    );
  };

  const openQuestionDeleteModal = (targetId: number) => {
    if (!selectedWorkbookId) return;

    const handleDelete = () => {
      deleteQuestionMutate({
        userId,
        questionId: targetId,
        workbookId: selectedWorkbookId,
      });

      // 질문 삭제 시, 해당 질문이 선택되어 있을 경우 선택된 질문들에서 제거
      setInterviewOption((prev) => ({
        ...prev,
        questions: prev.questions.filter((question) => question.questionId !== targetId),
      }));

      closeModal();
    };

    openModal(
      <DeleteDialog
        title="질문 삭제"
        message="선택한 질문을 삭제하시겠습니까?"
        onClose={closeModal}
        onDelete={handleDelete}
      />,
    );
  };

  const isAllChecked =
    questionList?.every((question) =>
      selectedQuestions.some(
        (selectedQuestion) => selectedQuestion.questionId === question.questionId,
      ),
    ) || false;

  const selectedWorkbook = workbookList.find((workbook) => workbook.listId === selectedWorkbookId);
  const questionTitle = selectedWorkbook?.title || "";

  if (workbookListLoading || questionListLoading) return <Loading />;

  return (
    <div className="flex flex-col sm:flex-row">
      {/* 워크북 리스트 */}
      <div className="flex flex-col mr-0 sm:mr-2">
        {workbookList?.map(({ listId, title }) => {
          const isSelected = selectedWorkbookId === listId;
          return (
            <Button
              key={listId}
              variant="outline"
              className={`border-none text-left line-clamp-1 overflow-hidden ${
                isSelected ? "bg-muted" : ""
              }`}
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
      <div className="flex-col w-full h-full border rounded-md max-h-96 overflow-y-auto">
        {/* 질문 헤더 */}
        <QuestionItem
          title={questionTitle}
          checked={isAllChecked}
          onClick={handleCheckAll}
          onDelete={openWorkbookDeleteModal}
        />
        {/* 질문 아이템 */}
        {questionList?.map((question) => (
          <QuestionItem
            key={question.questionId}
            answer={question.answerContent}
            title={question.questionContent}
            allowOpen
            checked={selectedQuestions.some(
              (selectedQuestion) => selectedQuestion.questionId === question.questionId,
            )}
            onClick={() => handleCheckOne(question.questionId)}
            onDelete={() => openQuestionDeleteModal(question.questionId)}
          />
        ))}

        <div className="px-4 py-4 flex flex-col items-center justify-center">
          {questionList?.length === 0 && (
            <span className="text-gray-500 text-sm mb-2">
              등록된 질문이 없네요. 버튼을 눌러 질문을 추가해보세요!
            </span>
          )}
          <Button variant="outline" onClick={openAddQuestionModalHandler}>
            면접 질문 추가하기
          </Button>
        </div>
      </div>
    </div>
  );
};

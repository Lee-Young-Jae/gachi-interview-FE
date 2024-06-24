import Loading from "@/app/(AfterLogin)/_component/Loading";
import { useGetQuestionsQuery } from "../../../_lib/queries/useQuestions";
import QuestionList from "./QuestionList";
import QuestionListHeader from "./QuestionListHeader";
import { useRecoilState } from "recoil";
import { interviewOptionState, QuestionType } from "../../../../../_lib/atoms/interviewState";

interface QuestionSelectionSectionProps {
  workbookId: number | null;
  questionTitle: string;
}

const QuestionSelectionSection = ({ workbookId, questionTitle }: QuestionSelectionSectionProps) => {
  const [interviewOption, setInterviewOption] = useRecoilState(interviewOptionState);
  const { data: questions, isLoading } = useGetQuestionsQuery({ workbookId: workbookId || -1 });

  const getPrevQuestionIds = () => interviewOption.questions.map((question) => question.questionId);

  const selectAllQuestions = () => {
    if (!questions) return;
    setInterviewOption((prev) => {
      const prevQuestionIds = getPrevQuestionIds();
      const isAllSelected = questions.every((question) =>
        prevQuestionIds.includes(question.questionId),
      );
      const updatedQuestions = isAllSelected ? [] : questions;
      return {
        ...prev,
        questions: updatedQuestions as QuestionType[],
      };
    });
  };

  const selectQuestion = (id: number) => {
    if (!questions) return;
    setInterviewOption((prev) => {
      const prevQuestionIds = getPrevQuestionIds();

      const updatedQuestions = prevQuestionIds.includes(id)
        ? prev.questions.filter((question) => question.questionId !== id)
        : [
            // 기존에 선택된 질문들에서 다른 워크북의 질문을 제거하고 새로 선택한 질문을 추가
            ...prev.questions.filter((question) =>
              questions.map((item) => item.questionId).includes(question.questionId),
            ),
            questions.find((question) => question.questionId === id) || [],
          ];
      return {
        ...prev,
        questions: updatedQuestions as QuestionType[],
      };
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="flex-col w-full ml-2">
      <div className="rounded-md border w-full max-h-96 overflow-y-auto">
        <QuestionListHeader
          questions={questions}
          questionTitle={workbookId ? questionTitle : "질문 세트가 없어요."}
          onSelect={selectAllQuestions}
          workbookId={workbookId}
        />
        {workbookId && (
          <QuestionList
            workbookId={workbookId}
            interviewOption={interviewOption}
            onSelect={selectQuestion}
          />
        )}
      </div>
    </div>
  );
};

export default QuestionSelectionSection;

import {
  InterviewOptionType,
  interviewOptionState,
} from "@/app/(AfterLogin)/(interview)/_lib/atoms/interviewState";
import {
  useGetQuestionsQuery,
  usePostQuestionsMutation,
} from "../../../../_lib/queries/useQuestions";
import QuestionItem from "./QuestionItem";
import { Button } from "@/components/ui/button";
import AddQuestionModal from "../Modals/AddQuestionModal";
import { useModal } from "@/components/Modal/useModal";
import { useRecoilValue } from "recoil";
import { userIdState } from "@/store/auth";
import Loading from "@/app/(AfterLogin)/_component/Loading";

interface QuestionListProps {
  workbookId: number;
  onSelect: (id: number) => void;
  interviewOption: InterviewOptionType;
}

const QuestionList = ({ workbookId, onSelect, interviewOption }: QuestionListProps) => {
  const { data: questionList, isLoading } = useGetQuestionsQuery({ workbookId });
  const { openModal, closeModal } = useModal();
  const { mutate } = usePostQuestionsMutation();
  const userId = useRecoilValue(userIdState);

  const openAddQuestionModalHandler = () =>
    openModal(
      <AddQuestionModal
        disableBackdropClick={true}
        closeModal={closeModal}
        // TODO: 인라인 함수 제거
        onSubmit={(questionContent, answerContent) => {
          mutate({
            userId,
            questionContent,
            answerContent,
            workbookId,
          });
          closeModal();
        }}
      />,
    );

  if (isLoading) return <Loading />;

  return (
    <ul>
      {questionList?.map((question) => (
        <QuestionItem
          key={question.questionId}
          id={question.questionId}
          content={question.questionContent}
          answer={question.answerContent}
          onSelect={onSelect}
          checked={interviewOption.questions.includes(question)}
          workbookId={workbookId}
        />
      ))}
      <li className="px-4 py-4 flex flex-col items-center justify-center transition-colors">
        {questionList?.length === 0 && (
          <label className="text-gray-500 text-sm mb-2">
            등록된 질문이 없네요. 버튼을 눌러 질문을 추가해보세요!
          </label>
        )}
        <Button variant="outline" onClick={openAddQuestionModalHandler}>
          면접 질문 추가하기
        </Button>
      </li>
    </ul>
  );
};

export default QuestionList;

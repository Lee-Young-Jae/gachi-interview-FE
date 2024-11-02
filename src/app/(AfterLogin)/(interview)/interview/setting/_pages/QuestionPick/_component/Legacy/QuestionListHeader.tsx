import { interviewOptionState } from "@/app/(AfterLogin)/(interview)/_lib/atoms/interviewState";
import { useRecoilValue } from "recoil";
import { ResponseQuestions } from "../../../../_lib/queries/useQuestions";
import { AiOutlineDelete } from "react-icons/ai";
import { userIdState } from "@/store/auth";
import { useDeleteWorkbookMutation } from "../../../../_lib/queries/useWorkbookListQuery";
import { useModal } from "@/components/Modal/useModal";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { useRecoilState } from "recoil";

interface SelectQuestionHeaderProps {
  questions: ResponseQuestions | undefined;
  questionTitle: string;
  onSelect: () => void;
  workbookId: number | null;
}

const QuestionListHeader = ({
  questions = [],
  questionTitle,
  onSelect,
  workbookId,
}: SelectQuestionHeaderProps) => {
  const [interviewOption, setInterviewOption] = useRecoilState(interviewOptionState);
  const { mutate } = useDeleteWorkbookMutation();
  const userId = useRecoilValue(userIdState);
  const { openModal, closeModal } = useModal();

  const openDeleteModal = () => {
    const handleDelete = () => {
      if (!workbookId) return;
      mutate({ workbookId, userId });

      // 질문지 삭제 시, 선택된 질문들도 초기화
      setInterviewOption((prev) => ({
        ...prev,
        questions: [],
      }));
      closeModal();
    };

    openModal(
      <Modal
        header="질문지 삭제"
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </>
        }
      >
        <>
          <p>선택한 질문지를 삭제할까요?</p>
          <p>포함된 질문들도 함께 삭제됩니다.</p>
        </>
      </Modal>,
    );
  };

  if (!questions) return null;

  return (
    <header
      className="group px-4 py-3 flex flex-row items-center border-b transition-colors hover:bg-muted/50 cursor-pointer"
      onClick={onSelect}
    >
      <input
        className="cursor-pointer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        type="checkbox"
        checked={questions?.every((question) => interviewOption.questions.includes(question))}
        readOnly
        id="all"
        value="all"
      />
      <label
        htmlFor="all"
        className="ml-7 text-gray-500 cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      >
        {questionTitle} <sub>(모두 선택)</sub>
      </label>

      <div className="flex-grow flex items-center justify-end">
        <AiOutlineDelete
          className="text-gray-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={openDeleteModal}
        />
      </div>
    </header>
  );
};

export default QuestionListHeader;

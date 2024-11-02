import Modal from "@/components/Modal";
import { useModal } from "@/components/Modal/useModal";
import { AiOutlineDelete } from "react-icons/ai";
import { useDeleteQuestionMutation } from "../../../../_lib/queries/useQuestions";
import { interviewOptionState } from "@/app/(AfterLogin)/(interview)/_lib/atoms/interviewState";
import { useRecoilValue, useRecoilState } from "recoil";
import { userIdState } from "@/store/auth";
import { Button } from "@/components/ui/button";

interface QuestionItemProps {
  id: number;
  content: string;
  answer: string;
  checked: boolean;
  onSelect: (id: number) => void;
  workbookId: number;
}

const QuestionItem = ({
  id,
  content,
  answer,
  onSelect,
  checked,
  workbookId,
}: QuestionItemProps) => {
  const { openModal, closeModal } = useModal();
  const { mutate } = useDeleteQuestionMutation();
  const userId = useRecoilValue(userIdState);
  const [_, setInterviewOption] = useRecoilState(interviewOptionState);

  const openDeleteModal = () => {
    const handleDelete = () => {
      mutate({
        userId,
        questionId: id,
        workbookId: workbookId,
      });

      // 질문 삭제 시, 해당 질문이 선택되어 있을 경우 선택된 질문들에서 제거
      setInterviewOption((prev) => ({
        ...prev,
        questions: prev.questions.filter((question) => question.questionId !== id),
      }));

      closeModal();
    };

    openModal(
      <Modal
        header="질문 삭제"
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
        <p>선택한 질문을 삭제하시겠습니까?</p>
      </Modal>,
    );
  };

  return (
    <>
      <li
        onClick={() => onSelect(id)}
        className="px-4 py-4 flex border-b transition-colors hover:bg-muted/50 group relative"
      >
        <input
          id={id.toString()}
          className="cursor-pointer absolute top-5 h-4 w-4"
          type="checkbox"
          checked={checked}
          readOnly
          value={id}
        />
        <div className="flex flex-col cursor-pointer w-full gap-3">
          <div className="ml-11 flex justify-between items-center">
            <label
              onClick={(e) => {
                e.stopPropagation();
              }}
              htmlFor={id.toString()}
              className="cursor-pointer text-gray-700 line-clamp-1 select-none"
            >
              {content}
            </label>
            <div
              className="flex items-center absolute right-4 group-hover:opacity-100 opacity-0 transition-opacity duration-200"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <AiOutlineDelete
                onClick={openDeleteModal}
                className="cursor-pointer opacity-0 group-hover:opacity-100 hover:scale-110 transition-transform duration-200"
              />
            </div>
          </div>
          {checked && (
            <div className="flex animate-fadeIn ml-11">
              <p className="text-sm text-gray-500">{answer}</p>
            </div>
          )}
        </div>
      </li>
    </>
  );
};

export default QuestionItem;

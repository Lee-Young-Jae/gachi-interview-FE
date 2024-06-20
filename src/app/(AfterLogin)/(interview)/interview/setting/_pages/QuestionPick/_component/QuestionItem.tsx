import Modal from "@/components/Modal";
import { useModal } from "@/components/Modal/useModal";
import { AiOutlineSearch, AiOutlineDelete } from "react-icons/ai";
import { useDeleteQuestionMutation } from "../../../_lib/queries/useQuestions";
import { useRecoilValue } from "recoil";
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
  const { mutate, isSuccess } = useDeleteQuestionMutation();
  const userId = useRecoilValue(userIdState);

  const openDeleteModal = () => {
    const handleDelete = () => {
      mutate({
        userId,
        questionId: id,
        workbookId: workbookId,
      });

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

  const openDetailModal = () => {
    openModal(
      <Modal header="질문 상세" footer={null}>
        <div className="flex flex-col w-full">
          <label className="text-gray-500">Q.</label>
          <textarea
            className="text-gray-700 text-sm bg-gray-100 p-2 rounded-md break-words resize-none"
            value={content}
            readOnly
          />
          <label className="text-gray-500 mt-4">A.</label>
          <textarea
            className="w-full text-gray-700 text-sm bg-gray-100 p-2 rounded-md break-words resize-none h-36"
            value={answer}
            readOnly
          />
        </div>
      </Modal>,
    );
  };

  return (
    <li
      onClick={() => onSelect(id)}
      className="px-4 py-4 flex items-center border-b transition-colors hover:bg-muted/50 group cursor-pointer"
    >
      <input
        id={id.toString()}
        className="cursor-pointer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        type="checkbox"
        checked={checked}
        readOnly
        value={id}
      />

      <label
        onClick={(e) => {
          e.stopPropagation();
        }}
        htmlFor={id.toString()}
        className="ml-12 cursor-pointer text-gray-700 line-clamp-1 select-none"
      >
        {content}
      </label>
      <div
        className="ml-auto flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <AiOutlineDelete
          onClick={openDeleteModal}
          className="cursor-pointer opacity-0 group-hover:opacity-100 hover:scale-110 transition-transform duration-200"
        />
        <AiOutlineSearch
          onClick={openDetailModal}
          className="cursor-pointer opacity-0 group-hover:opacity-100 hover:scale-110 transition-transform duration-200"
        />
      </div>
    </li>
  );
};

export default QuestionItem;

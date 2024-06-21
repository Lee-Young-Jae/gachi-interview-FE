import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AddQuestionModalProps {
  closeModal: () => void;
  onSubmit: (question: string, answer: string) => void;
  disableBackdropClick?: boolean;
}

const AddQuestionModal = ({ closeModal, onSubmit }: AddQuestionModalProps) => {
  const [questionContent, setContent] = useState("");
  const [answerContent, setAnswer] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (questionContent === "") {
      setError("질문은 필수입니다.");
      return false;
    }

    if (questionContent.length > 999) {
      setError("질문은 1000자 이내로 입력해주세요.");
      return false;
    }
    return true;
  };

  const handleCreate = () => {
    if (!validate()) return;
    onSubmit(questionContent, answerContent);
    closeModal();
  };

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  return (
    <Modal
      header="질문 & 답변 추가"
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => {
              closeModal();
            }}
          >
            취소
          </Button>
          <Button onClick={handleCreate}>추가</Button>
        </>
      }
    >
      <label className="text-sm">질문</label>
      <input
        type="text"
        value={questionContent}
        onChange={handleTitle}
        placeholder="질문을 입력해주세요."
        className="w-full p-2 border border-gray-300 rounded-md mt-4"
        required
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <textarea
        placeholder="예시 답변을 입력해주세요."
        value={answerContent}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full resize-none p-2 border border-gray-300 rounded-md mt-4 h-80"
      />
    </Modal>
  );
};

export default AddQuestionModal;

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";

// 워크북/질문 삭제 Dialog
interface DeleteDialogProps {
  title: string;
  message: string | React.ReactNode;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteDialog = ({ title, message, onClose, onDelete }: DeleteDialogProps) => (
  <Modal
    header={title}
    footer={
      <>
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          삭제
        </Button>
      </>
    }
  >
    <p>{message}</p>
  </Modal>
);

export default DeleteDialog;

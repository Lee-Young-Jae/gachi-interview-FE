import Modal from "@/components/Modal";
import { useModal } from "@/components/Modal/useModal";
import { Button } from "@/components/ui/button";
import { localDownload } from "@/lib/utils/record";
import { useRouter } from "next/navigation";

interface UploadCompletionModalProps {
  encodedBlob: Blob;
  isPublic: boolean;
  disableBackdropClick?: boolean;
  feedbackLimitCount: number;
  feedbackCurrentCount: number;
}

const UploadCompletionModal = ({
  encodedBlob,
  isPublic,
  feedbackCurrentCount,
  feedbackLimitCount,
}: UploadCompletionModalProps) => {
  const router = useRouter();
  const { closeModal } = useModal();

  const handleDownload = () => {
    localDownload(encodedBlob);
  };

  // TODO: 클립보드에 복사하는 기능 추가
  const handleCopyLink = () => {
    console.log("copy to clipboard");
    alert("클립보드에 복사되었습니다.");
  };

  // TODO: 영상이 public-> 영상 목록의 해당 비디오 게시물로 이동, 비공개-> 마이페이지로 이동
  const handleMoveToVideoDetail = () => {
    if (isPublic) {
      closeModal();
      router.push("/videos/");
      return;
    }
    router.push("/my?tab=videos");
    closeModal();
  };

  const renderMessage = () => {
    if (feedbackCurrentCount + 1 === feedbackLimitCount) {
      return (
        <>
          <p>
            면접은 잘 보셨나요? 😚
            <br />
            아쉽지만 현재 서비스 사용량이 많아 추가 피드백은 <b>1회</b> 더 받을 수 있어요!
          </p>
          <br />
        </>
      );
    }

    if (feedbackCurrentCount < feedbackLimitCount) {
      return <p>🤖 AI가 영상 분석을 끝내면 알림을 보내드릴게요!</p>;
    }

    if (feedbackCurrentCount >= feedbackLimitCount) {
      return (
        <>
          <p>
            <br />
            오늘 AI가 너무 많은 일을 처리하고 휴식 중이에요. <br />
            아쉽지만 피드백은 내일 다시 도와드릴게요. <br />
            영상녹화와, 기기에 저장하기는 언제든지 가능해요!🎥
          </p>
          <br />
        </>
      );
    }

    return null;
  };

  return (
    <Modal
      disableBackdropClick={true}
      header="인코딩 완료!"
      footer={
        <>
          <Button onClick={handleMoveToVideoDetail}>내 영상 확인하기</Button>
        </>
      }
    >
      <p>비디오 인코딩이 완료되었어요.</p>
      {renderMessage()}
      영상을 기기에 <b>다운로드</b> 하시고 싶으시거나, <b>링크를 공유</b>하고 싶으시다면 아래 버튼을
      눌러주세요.
      <div className="flex flex-col gap-2 mt-4">
        <Button variant="outline" onClick={handleDownload}>
          이 기기에 내려받기
        </Button>
        <Button variant="outline" onClick={handleCopyLink}>
          영상 링크 공유하기
        </Button>
      </div>
    </Modal>
  );
};

export default UploadCompletionModal;

import Modal from "@/components/Modal";
import { Suspense } from "react";
import vacation from "../../../../../../../../../../public/vacationL.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

export const Vacation = () => {
  return (
    <div className="flex items-center justify-center w-full h-3/4 overflow-hidden">
      <Lottie play animationData={vacation} className="object-scale-down w-3/4" />
    </div>
  );
};

// 생성 실패 모달
const CreateWorkbookFailModal = ({ onClose }: { onClose: () => void }) => (
  <Modal
    header="질문지 생성 실패 - 휴식 중인 AI"
    footer={
      <button className="btn btn-primary" onClick={onClose}>
        확인
      </button>
    }
  >
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-full h-full overflow-hidden">
          휴식 중인 AI를 불러오는 중...
        </div>
      }
    >
      <Vacation />
    </Suspense>
    <p>같이면접 질문/답변 AI가 잠시 휴식중이에요... 😅</p> <br />
    <p>아쉽지만 내일 다시 요청해주시면 더 좋은 결과를 보내드릴게요!</p>
    <sub>직접 질문/답변을 입력하시는 건 언제든 가능해요!!</sub>
  </Modal>
);

export default CreateWorkbookFailModal;

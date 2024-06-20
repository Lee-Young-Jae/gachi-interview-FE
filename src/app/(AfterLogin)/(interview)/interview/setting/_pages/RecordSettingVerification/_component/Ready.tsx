import dynamic from "next/dynamic";
import ready from "../../../../../../../../../public/interviewL.json";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

const Ready = () => {
  return (
    <div className="flex items-center justify-center w-full h-full overflow-hidden">
      <Lottie play animationData={ready} className="object-scale-down max-h-96" />
    </div>
  );
};

export default Ready;

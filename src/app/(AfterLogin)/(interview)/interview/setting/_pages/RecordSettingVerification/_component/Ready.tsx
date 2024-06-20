import dynamic from "next/dynamic";
import ready from "../../../../../../../../../public/interviewL.json";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

const Ready = () => {
  return (
    <div className="flex items-center justify-center my-16">
      <Lottie play animationData={ready} className="w-96 h-40" />
    </div>
  );
};

export default Ready;

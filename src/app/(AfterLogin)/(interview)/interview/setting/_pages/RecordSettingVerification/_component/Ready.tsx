import dynamic from "next/dynamic";
import ready from "../../../../../../../../../public/interviewL.json";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

const Ready = () => {
  return (
    <div className="flex items-center justify-center my-16 w-full">
      <Lottie play animationData={ready} className="w-full h-full" />
    </div>
  );
};

export default Ready;

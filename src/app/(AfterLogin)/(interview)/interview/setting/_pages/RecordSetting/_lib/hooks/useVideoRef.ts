import { useEffect, useRef } from "react";
import { mediaOptionState } from "@/app/(AfterLogin)/(interview)/_lib/atoms/interviewState";
import { useRecoilState } from "recoil";

export const useVideoRef = () => {
  const videoContainerRef = useRef<HTMLVideoElement>(null);
  const [mediaOption] = useRecoilState(mediaOptionState);

  useEffect(() => {
    videoContainerRef.current!.srcObject = mediaOption.media;
  }, [mediaOption.media]);

  return videoContainerRef;
};

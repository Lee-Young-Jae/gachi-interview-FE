"use client";

import React, { MutableRefObject } from "react";
import { toBlobURL } from "@ffmpeg/util";
import { FFmpeg } from "@ffmpeg/ffmpeg";

type StartRecordingProps = {
  media: MediaStream | null;
  selectedMimeType: string;
  mediaRecorderRef: MutableRefObject<MediaRecorder | null>;
  setRecordedBlobs: React.Dispatch<React.SetStateAction<Blob[]>>;
};

// next.js가 node.js 환경에서 실행되기 때문에 node에서의 사용을 지원하지 않는 ffmpeg을 사용하기 위해 브라우저에서 사용할 수 있도록 설정
const initializeFFmpegInstance = async (logs = false) => {
  const ffmpeg = new FFmpeg();

  const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd";

  if (!ffmpeg.loaded) {
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript"),
    });
  }

  if (logs)
    ffmpeg.on("log", ({ message }) => {
      console.log(message);
    });
  return ffmpeg;
};

export const startRecording = ({
  media,
  selectedMimeType,
  mediaRecorderRef,
  setRecordedBlobs,
}: StartRecordingProps) => {
  try {
    mediaRecorderRef.current = new MediaRecorder(media as MediaStream, {
      mimeType: selectedMimeType,
      videoBitsPerSecond: 300000,
    });

    mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
      console.log("녹화 데이터가 수신되었습니다.", event.data);
      if (event.data && event.data.size > 0) {
        setRecordedBlobs((prevBlobs) => [...prevBlobs, event.data]);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      console.log("녹화가 종료되었습니다.");
    };

    mediaRecorderRef.current.start(1000);
    console.log("미디어 레코딩을 시작합니다.", mediaRecorderRef);
  } catch (error) {
    console.error("미디어 레코딩 중 오류가 발생했습니다.");
    console.error(error);
  }
};

export const stopRecording = (mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>) => {
  return new Promise<void>((resolve) => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = () => {
        resolve();
      };
      mediaRecorderRef.current.stop();
    }
  });
};

export const localDownload = async (blob: Blob, fileName?: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  if (!fileName) {
    fileName = new Date().toISOString().replace(/:/g, "-");
  }
  a.download = `${fileName}.mp4`;

  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

const createTempThumbnail = async (): Promise<Blob> => {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 360;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("캔버스 컨텍스트를 가져올 수 없습니다.");
  }

  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((thumbnailBlob) => {
      if (!thumbnailBlob) {
        throw new Error("썸네일 이미지를 생성할 수 없습니다.");
      }
      resolve(thumbnailBlob);
    }, "image/png");
  });
};

export const getThumbnailImage = async (blob: Blob, time?: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(blob);
    video.preload = "metadata"; // 메타데이터만 로드하도록 설정

    video.onloadedmetadata = () => {
      if (!video.videoWidth || !video.videoHeight) {
        console.error("비디오의 메타데이터를 로드하는 중에 오류가 발생했습니다.");
        console.log("임시 썸네일 생성");
        createTempThumbnail().then(resolve).catch(reject);
        return;
      }

      video.currentTime = time || 1;
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("캔버스 컨텍스트를 가져올 수 없습니다."));
        return;
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((thumbnailBlob) => {
        if (!thumbnailBlob) {
          reject(new Error("썸네일 이미지를 생성할 수 없습니다."));
          return;
        }
        resolve(thumbnailBlob);
      }, "image/png");
    };

    video.onerror = () => {
      console.error("비디오를 로드하는 중에 오류가 발생했습니다.");
      createTempThumbnail().then(resolve).catch(reject);
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("캔버스 컨텍스트를 가져올 수 없습니다."));
        return;
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((thumbnailBlob) => {
        if (!thumbnailBlob) {
          reject(new Error("썸네일 이미지를 생성할 수 없습니다."));
          return;
        }
        resolve(thumbnailBlob);
      }, "image/png");
    };

    video.onerror = () => {
      reject(new Error("비디오를 로드하는 중에 오류가 발생했습니다."));
    };
  });
};

export const getThumbnailImages = async (blobs: Blob, videoDuration: number): Promise<Blob[]> => {
  const times = Array.from({ length: 5 }, (_, index) => {
    return Math.floor((videoDuration / 5) * index);
  });

  const thumbnailBlobs = await Promise.all(
    times.map(async (time) => {
      return await getThumbnailImage(blobs, time);
    }),
  );

  return thumbnailBlobs;
};

export const EncodingWebmToMp4 = async (blob: Blob) => {
  console.time("EncodingWebmToMp4");
  // 유저 에이전트가 IOS 혹은 Android인 경우에는 Blob을 그대로 반환
  if (navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("Android")) {
    console.timeEnd("EncodingWebmToMp4");
    return blob;
  }

  const ffmpeg = await initializeFFmpegInstance();

  const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd";

  if (!ffmpeg.loaded) {
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript"),
    });
  }

  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  await ffmpeg.writeFile("input.webm", uint8Array);

  try {
    await ffmpeg.exec([
      "-i",
      "input.webm",
      "-c:v",
      "libx264",
      "-preset", // 인코딩 속도 설정
      "ultrafast", // 인코딩 속도 설정
      "-r", // 프레임 레이트 설정
      "30", // 프레임 레이트 설정
      "-crf", // 비디오 품질 설정
      "20", // 0 ~ 51 (낮을수록 높은 품질)
      "-c:a", // 오디오 코덱 설정
      "copy", // 오디오 코덱을 그대로 유지 (복사)
      "-vf", // 비디오 필터 설정
      "format=yuv420p", // mp4에 적합한 픽셀 포맷
      "-movflags", // 빠른 스트리밍을 위한 faststart 플래그
      "+faststart", // 빠른 스트리밍을 위한 faststart 플래그
      "output.mp4",
    ]);
  } catch (error) {
    console.error("ffmpeg 실행 중 오류가 발생했습니다.", error);
  }

  console.log("output.mp4 파일 작성 완료");
  const data = await ffmpeg.readFile("output.mp4");
  const newBlob = new Blob([data], { type: "video/mp4;" });

  console.timeEnd("EncodingWebmToMp4");

  return newBlob;
};

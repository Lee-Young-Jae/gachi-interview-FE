export const closeMedia = (media: MediaStream | null) => {
  if (media) {
    media.getTracks().forEach((track) => track.stop());
  }
};

export const getMedia = async (
  audioDeviceId?: string,
  videoDeviceId?: string,
): Promise<MediaStream | null> => {
  try {
    const media = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: { exact: true },
        noiseSuppression: { exact: true },
        autoGainControl: { exact: true },
        deviceId: audioDeviceId ? { exact: audioDeviceId } : undefined,
      },
      video: {
        width: 640,
        height: 360,
        frameRate: 30,
        deviceId: videoDeviceId ? { exact: videoDeviceId } : undefined,
      },
    });

    return media;
  } catch (error) {
    throw new Error();
  }
};

export const getAudioOnlyMedia = async (audioDeviceId?: string): Promise<MediaStream | null> => {
  try {
    const media = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: { exact: true },
        noiseSuppression: { exact: true },
        autoGainControl: { exact: true },
        deviceId: audioDeviceId ? { exact: audioDeviceId } : undefined,
      },
    });

    return media;
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};

export const getSupportedMimeTypes = () => {
  let selectedMimeType = "video/webm; codecs=h264";
  if (MediaRecorder.isTypeSupported("video/webm; codecs=vp9")) {
    selectedMimeType = "video/webm; codecs=vp9";
  } else if (MediaRecorder.isTypeSupported("video/webm")) {
    selectedMimeType = "video/webm";
  } else if (MediaRecorder.isTypeSupported("video/mp4")) {
    selectedMimeType = "video/mp4";
  } else {
    console.error("no suitable mimetype found for this device");
  }

  return selectedMimeType;
};

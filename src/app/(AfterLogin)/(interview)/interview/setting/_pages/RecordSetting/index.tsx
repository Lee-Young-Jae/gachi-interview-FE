import { AiOutlineReload } from "react-icons/ai";
import { useRecoilValue } from "recoil";
import { mediaOptionState } from "../../../../_lib/atoms/interviewState";
import { useSelectedDevices } from "./_lib/hooks/useSelectedDevices";
import { useMediaDevices } from "./_lib/hooks/useMediaDevices";
import { useVideoRef } from "./_lib/hooks/useVideoRef";

const RecordSetting = () => {
  const mediaOption = useRecoilValue(mediaOptionState);
  const {
    handleAudioDeviceChange,
    handleCameraDeviceChange,
    handleReloadRecording,
    selectedAudioDevice,
    selectedCameraDevice,
    handleAudioOnly,
  } = useSelectedDevices();
  const { audioDevices, cameraDevices } = useMediaDevices();
  const videoRef = useVideoRef();

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full h-96 rounded overflow-hidden relative">
        {!mediaOption.media && (
          <AiOutlineReload
            className="absolute z-10 bg-inherit cursor-pointer text-white transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full top-1/2 left-1/2"
            onClick={handleReloadRecording}
          />
        )}
        <video
          className="w-full h-full rounded block scale-x-[-1] object-contain overflow-clip bg-black"
          autoPlay
          playsInline
          ref={videoRef}
          muted
        />
      </div>
      {!cameraDevices.length && (
        <div className="mt-2">
          <span>카메라가 없으신가요? </span>
          <button className="text-blue-500" onClick={handleAudioOnly}>
            오디오만 녹화하기
          </button>
        </div>
      )}
      <div className="w-full flex flex-col md:flex-row mt-4 md:justify-center">
        <select
          className="border border-gray-300 rounded-md p-2 text-sm"
          value={selectedCameraDevice}
          onChange={(e) => handleCameraDeviceChange(e.target.value)}
        >
          {cameraDevices.length === 0 && (
            <option value="" disabled>
              카메라 장치가 없습니다.
            </option>
          )}
          {cameraDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera Device ${device.deviceId}`}
            </option>
          ))}
        </select>
        <select
          className="border border-gray-300 rounded-md p-2 text-sm md:ml-2 mt-2 md:mt-0"
          value={selectedAudioDevice}
          onChange={(e) => {
            handleAudioDeviceChange(e.target.value);
          }}
        >
          {audioDevices.length === 0 && (
            <option value="" disabled>
              마이크 장치가 없습니다.
            </option>
          )}
          {audioDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Audio Device ${device.deviceId}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RecordSetting;

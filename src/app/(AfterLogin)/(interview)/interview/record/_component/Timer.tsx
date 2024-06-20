interface TimerProps {
  seconds: number;
}

const MAX_TIME = 60 * 5;

const Timer = ({ seconds }: TimerProps) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="z-10 p-2 rounded-xl transform border-2 border-gray-400 bg-black">
      <div className="flex items-center justify-center gap-2">
        <div className="flex flex-col items-center gap-1">
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className={`h-full rounded-full ${
                // 80% 이상이면 빨간색, 80% 미만이면 초록색
                seconds / MAX_TIME > 0.8 ? "bg-red-500" : "bg-green-500"
              }`}
              style={{ width: `${(seconds / MAX_TIME) * 100}%` }}
            ></div>
          </div>
          <span className="text-base text-gray-400">{formatTime(seconds)}</span>
        </div>
      </div>
    </div>
  );
};

export default Timer;

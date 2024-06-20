interface TranscriptProps {
  transcript: string;
}

const Transcript = ({ transcript }: TranscriptProps) => {
  return (
    <div className="absolute top-[85%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 p-4 rounded-lg text-white text-base z-10 max-h-[15%] w-[80%] overflow-y-scroll">
      <div className="flex items-center justify-center gap-2">
        <div className="flex flex-col items-center gap-1">
          <span
            className="text-base
            text-gray-400"
          >
            {transcript}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Transcript;

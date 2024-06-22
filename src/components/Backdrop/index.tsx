interface BackdropProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  isAnimating?: boolean;
}
const Backdrop = ({ children, onClick, isAnimating }: BackdropProps) => {
  return (
    <div
      className={`w-full h-full bg-black bg-opacity-50 flex items-center justify-center fixed top-0 left-0 z-50 transition-opacity duration-300 ${
        isAnimating ? "opacity-0" : "opacity-100"
      }`}
      onClick={onClick}
    >
      <div
        className={`${
          isAnimating ? "animate-fadeOutAndSlideDown" : ""
        } w-full max-w-lg sm:rounded-lg sm:max-w-[425px]`}
      >
        {children}
      </div>
    </div>
  );
};

export default Backdrop;

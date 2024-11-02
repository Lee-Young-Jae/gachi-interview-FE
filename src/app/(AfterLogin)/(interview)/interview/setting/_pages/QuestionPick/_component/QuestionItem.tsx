import { AiOutlineDelete } from "react-icons/ai";

interface QuestionItemProps {
  checked: boolean;
  allowOpen?: boolean; // 펼쳐질 수 있는지 여부를 나타내는 props
  title: string;
  answer?: string;
  onClick: () => void;
  onDelete: () => void;
}

const QuestionItem = ({
  onClick,
  onDelete,
  checked,
  allowOpen,
  title,
  answer,
}: QuestionItemProps) => {
  const handleDelete = (e: React.MouseEvent<SVGAElement>) => {
    e.stopPropagation();
    onDelete();
  };

  const isHeader = allowOpen;
  const isOpen = allowOpen && checked;

  return (
    <div
      className={`flex flex-col group ${
        isHeader ? "text-gray-700" : " text-gray-500"
      } border-b cursor-pointer hover:bg-muted/50`}
      onClick={onClick}
    >
      <div
        className={`grid grid-cols-2 items-center ${isHeader ? "p-4" : "py-3 px-4"}`}
        style={{
          gridTemplateColumns: "20px 2fr 20px",
        }}
      >
        <input type="checkbox" checked={checked} onChange={onClick} className="w-4 h-4" />
        <div className="ml-7">
          <span className="cursor-pointer line-clamp-1 select-none">
            {title} {!isHeader && <sub className="text-xs">(모두 선택)</sub>}
          </span>
        </div>

        <AiOutlineDelete
          className="invisible group-hover:visible cursor-pointer"
          onClick={handleDelete}
        />
        <div></div>
        {isOpen && (
          <div className="ml-7 mt-2 animate-fadeIn">
            <p className="text-sm text-gray-500">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionItem;

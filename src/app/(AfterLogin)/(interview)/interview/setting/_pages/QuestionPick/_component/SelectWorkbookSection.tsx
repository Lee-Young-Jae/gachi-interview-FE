import { useModal } from "@/components/Modal/useModal";
import {
  useGetWorkbookListQuery,
  usePostWorkbookMutation,
} from "../../../_lib/queries/useWorkbookListQuery";
import AddQuestionTitleModal from "./AddQuestionTitleModal";
import { useRecoilValue } from "recoil";
import { userIdState } from "@/store/auth";

interface SelectWorkbookSectionProps {
  selectedWorkbookId: number | null;
  setSelectedWorkbookId: (id: number) => void;
}

const SelectWorkbookSection = ({
  selectedWorkbookId,
  setSelectedWorkbookId,
}: SelectWorkbookSectionProps) => {
  const { data: questionList } = useGetWorkbookListQuery();
  const { mutate: createTitleMutate } = usePostWorkbookMutation();
  const { openModal, closeModal } = useModal();
  const userId = useRecoilValue(userIdState);

  const openAddTitleModalHandler = () => {
    const submitHandler = ({ title, job }: { title: string; job: string }) => {
      createTitleMutate({ userId, title, job });
      closeModal();
    };

    openModal(<AddQuestionTitleModal closeModal={closeModal} onSubmit={submitHandler} />);
  };

  //TODO: Popover로 워크북 삭제 기능 추가
  return (
    <ul>
      {questionList &&
        questionList.map((question) => (
          <li
            key={question.listId}
            className={`${
              selectedWorkbookId === question.listId && "bg-muted justify-start"
            } flex-col items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 justify-start cursor-pointer`}
            onClick={() => setSelectedWorkbookId(question.listId)}
          >
            {question.title}
          </li>
        ))}
      <li
        onClick={openAddTitleModalHandler}
        className="flex-col items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors h-9 px-4 py-2 justify-start cursor-pointer text-blue-600 hover:bg-muted hover:text-primary disabled:pointer-events-none disabled:opacity-50"
      >
        + 새 질문지를 만들게요.
      </li>
    </ul>
  );
};

export default SelectWorkbookSection;

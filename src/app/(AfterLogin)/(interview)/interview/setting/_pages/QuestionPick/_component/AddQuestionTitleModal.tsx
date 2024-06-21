import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface JobList {
  [key: string]: string[];
}

const jobList: JobList = require("../_lib/jobList.json") as JobList;

interface Job {
  name: string;
  MajorCategory: string;
}

interface AddQuestionTitleModalProps {
  closeModal: () => void;
  onSubmit: (data: { title: string; job: string }) => void;
  disableBackdropClick?: boolean;
}

const AddQuestionTitleModal = ({ closeModal, onSubmit }: AddQuestionTitleModalProps) => {
  const [title, setTitle] = useState("");
  const [isAIExample, setIsAIExample] = useState(false);
  const [job, setJob] = useState<Job>({
    MajorCategory: "",
    name: "",
  });

  const jobs: JobList = jobList;

  const [error, setError] = useState("");

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const validate = () => {
    if (title.length === 0) {
      setError("질문 세트의 제목을 입력해주세요.");
      return false;
    }

    if (title.length > 50) {
      setError("질문 세트의 제목은 50자 이내로 입력해주세요.");
      return false;
    }
    setError("");
    return true;
  };

  const handleCreate = () => {
    if (!validate()) {
      return;
    }
    onSubmit({
      title,
      job: `${job.MajorCategory}/${job.name}`,
    });
  };

  return (
    <Modal
      disableBackdropClick={true}
      header="질문 세트 추가"
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => {
              closeModal();
            }}
          >
            취소
          </Button>
          <Button onClick={handleCreate}>추가</Button>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <label className="block text-basic text-muted-foreground">세트 제목</label>
        <input
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          type="text"
          placeholder="질문 세트의 제목을 입력하세요."
          value={title}
          onChange={handleTitle}
        />
      </div>

      {isAIExample && (
        <div className="flex flex-col gap-2 mt-2">
          <label className="block text-basic text-muted-foreground">직군</label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(e) => setJob(JSON.parse(e.target.value))}
          >
            <option value="" className="text-muted-foreground">
              직군을 선택하세요.
            </option>
            {Object.keys(jobs).map((majorCategory) => (
              <option
                className="text-basic"
                key={majorCategory}
                value={JSON.stringify({ MajorCategory: majorCategory, name: "" })}
              >
                {majorCategory}
              </option>
            ))}
          </select>
        </div>
      )}

      {isAIExample && job.MajorCategory && (
        <div className="flex flex-col gap-2 mt-2">
          <label className="block text-basic text-muted-foreground">직무</label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(e) => setJob(JSON.parse(e.target.value))}
          >
            <option value="" className="text-muted-foreground">
              직무를 선택하세요.
            </option>
            {jobs[job.MajorCategory].map((jobName) => (
              <option
                className="text-basic"
                key={jobName}
                value={JSON.stringify({ MajorCategory: job.MajorCategory, name: jobName })}
              >
                {jobName}
              </option>
            ))}
          </select>
        </div>
      )}

      {!isAIExample && (
        <button className="mt-4 text-sm text-blue-600" onClick={() => setIsAIExample(true)}>
          AI 예시 질문/답변을 받아볼까요?
        </button>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </Modal>
  );
};

export default AddQuestionTitleModal;

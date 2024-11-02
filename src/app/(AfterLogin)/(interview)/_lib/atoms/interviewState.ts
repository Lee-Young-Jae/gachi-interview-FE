// interviewState.ts
import { atom } from "recoil";
import { ResponseQuestions } from "../../interview/setting/_lib/queries/useQuestions";

export type QuestionType = {
  questionId: number;
  questionContent: string;
  answerId: number;
  answerContent: string;
};

export interface InterviewOptionType {
  userId: number;
  exposure: boolean;
  videoLink: string;
  videoTitle: string;
  questions: ResponseQuestions;
  tags: string[];
}

export interface MediaOptionType {
  media: MediaStream | null;
  selectedMimeType: string;
}

export const interviewOptionState = atom<InterviewOptionType>({
  key: "interviewOptionState",
  default: {
    userId: 0,
    exposure: true,
    videoLink: "",
    videoTitle: "",
    questions: [],
    tags: [],
  },
});

export const mediaOptionState = atom<MediaOptionType>({
  key: "mediaOptionState",
  default: {
    media: null,
    selectedMimeType: "",
  },
});

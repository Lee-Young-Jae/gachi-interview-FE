"use client";

import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/components/Modal/useModal";
import { useRecoilValue } from "recoil";
import { accessTokenState, userIdState } from "@/store/auth";
import postBoard from "../create/_lib/postBoard";
import patchPost from "../edit/_lib/patchPost";

interface PostFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
  postId?: string;
  category: string;
  isEditing: boolean;
}

export default function PostUpdater({
  initialTitle = "",
  initialContent = "",
  initialTags = [],
  postId,
  category,
  isEditing,
}: PostFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState({ title: false, content: false, tags: false });
  const [isFocused, setIsFocused] = useState(false);
  const [isLinux, setIsLinux] = useState(false);
  const [tagWarning, setTagWarning] = useState("");

  const queryClient = useQueryClient();
  const { openDialogWithBack } = useModal();
  const accessToken = useRecoilValue(accessTokenState);
  const userId = useRecoilValue(userIdState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLinux(!!window.navigator.userAgent.match(/Linux/i));
    }
  }, []);

  const mutationFn = isEditing ? patchPost : postBoard;
  const mutationKey = isEditing ? ["community", postId] : ["community", category, "new", 1];

  const postData = useMutation({
    mutationKey,
    mutationFn: (postData: {
      title: string;
      content: string;
      tags: string[];
      category: string;
      accessToken: string;
      userId: number;
      postId?: string;
    }) => mutationFn(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: mutationKey,
      });
      openDialogWithBack(isEditing ? "게시글이 수정되었습니다." : "게시글이 등록되었습니다.");
    },
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      title: !title,
      content: !content,
      tags: tags.length === 0,
    };
    setErrors(newErrors);

    if (newErrors.title || newErrors.content || newErrors.tags) {
      return;
    }

    const removedDotTags = tags
      .map((item) => item.replaceAll(".", ""))
      .filter((item) => item !== "");

    postData.mutate({
      title,
      content,
      tags: removedDotTags,
      category,
      accessToken,
      userId,
      postId,
    });
  };

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (errors.title) setErrors((prev) => ({ ...prev, title: false }));
  };

  const handleContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (errors.content) setErrors((prev) => ({ ...prev, content: false }));
  };

  const handleNewTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagValue = e.target.value;
    if (tagValue.length > 10) {
      setTagWarning("태그는 최대 10자까지 입력 가능합니다!");
    } else {
      setTagWarning("");
      setNewTag(tagValue);
    }
  };

  const handleNewTagKeyDown = (e: React.KeyboardEvent) => {
    const targetKey = e.target as HTMLInputElement;

    if (
      (e.key === "Enter" || e.key === "NumpadEnter") &&
      e.nativeEvent.isComposing === false &&
      newTag.trim() !== ""
    ) {
      e.preventDefault();
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      setTagWarning("");
      if (errors.tags) setErrors((prev) => ({ ...prev, tags: false }));
    } else if (isLinux && targetKey.value.at(-1) === " ") {
      if (e.nativeEvent.isComposing) return;
      e.preventDefault();
      let trimmedTag = newTag.trim();
      if (trimmedTag.endsWith(" ")) {
        trimmedTag = trimmedTag.slice(0, -1).trim();
      }
      if (trimmedTag !== "") {
        setTags([...tags, trimmedTag]);
        setNewTag("");
        setTagWarning("");
        if (errors.tags) setErrors((prev) => ({ ...prev, tags: false }));
      }
    }
  };

  const handleBadgeClick = (clickedTagIndex: number) => {
    setTags(tags.filter((_, index) => index !== clickedTagIndex));
  };

  return (
    <>
      <p className="text-3xl font-bold mt-8">
        {category === "reviews"
          ? isEditing
            ? "면접 후기 수정"
            : "면접 후기 작성"
          : isEditing
          ? "스터디 모집 수정"
          : "스터디 모집 글 작성"}
      </p>
      <form onSubmit={onSubmit} className="flex flex-col w-full mt-2">
        <input
          type="text"
          placeholder="제목에 핵심 내용을 요약해 보세요"
          onChange={handleTitle}
          value={title}
          className="p-2 border border-gray-300 rounded-md mb-4 text-lg focus:outline-none"
        />
        <div className="mb-4 relative">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              className="mr-1 cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={() => handleBadgeClick(index)}
            >
              #{tag}
            </Badge>
          ))}
          <input
            type="text"
            value={newTag}
            onChange={handleNewTagChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleNewTagKeyDown}
            placeholder="태그를 입력하세요"
            className="w-2/3 border-none focus:outline-none"
          />
          {tagWarning && <p className="text-sm text-red-500 mt-1">{tagWarning}</p>}
          {isFocused && (
            <div className="absolute bg-gray-700 text-slate-100 text-xs p-2.5 mt-2 z-10 whitespace-pre-line">
              {isLinux
                ? "스페이스바를 두 번 눌러 태그를 추가하세요.\n등록된 태그를 클릭하면 삭제됩니다."
                : "엔터 키를 눌러 태그를 추가하세요.\n등록된 태그를 클릭하면 삭제됩니다."}
            </div>
          )}
        </div>
        <textarea
          placeholder={
            category === "reviews"
              ? `[면접 후기 내용 작성 가이드]\n\n - 면접 질문\n - 면접 답변 혹은 면접 느낌\n - 발표 시기`
              : `[스터디 모집 글 내용 작성 가이드]\n\n - 구체적인 스터디 내용\n - 모집 인원\n - 스터디 진행 방식`
          }
          onChange={handleContent}
          value={content}
          className="p-2 resize-none border border-gray-300 rounded-md mb-4 h-80 focus:outline-none"
        />
        {errors.title && <p className="text-sm text-red-500 pl-2 mb-2">제목을 입력해주세요.</p>}
        {errors.tags && (
          <p className="text-sm text-red-500 pl-2 mb-2">태그를 하나 이상 추가해주세요.</p>
        )}
        {errors.content && <p className="text-sm text-red-500 pl-2 mb-4">내용을 입력해주세요.</p>}
        <button type="submit" className="bg-black text-white font-bold py-2 px-4 rounded">
          {isEditing ? "수정 완료" : "등록"}
        </button>
      </form>
    </>
  );
}

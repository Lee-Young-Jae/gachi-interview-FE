"use client";

import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import postBoard from "../_lib/postBoard";
import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/components/Modal/useModal";
import { useRecoilValue } from "recoil";
import { accessTokenState, userIdState } from "@/store/auth";

export default function ReviewPostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState({ title: false, content: false, tags: false });

  const category = useSearchParams().get("tab");
  const queryClient = useQueryClient();
  const { openDialogWithBack, closeModal } = useModal();
  const accessToken = useRecoilValue(accessTokenState);
  const userId = useRecoilValue(userIdState);

  const postData = useMutation({
    mutationKey: ["community", category, "new", 1],
    mutationFn: (newPost: {
      title: string;
      content: string;
      tags: string[];
      category: string;
      accessToken: string;
      userId: number;
    }) => postBoard(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community", category, "new", 1],
      });
      openDialogWithBack("게시글이 등록되었습니다.");
    },
  });

  if (!category) return null;

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

    postData.mutate({
      title,
      content,
      tags,
      category,
      accessToken,
      userId,
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
    setNewTag(e.target.value);
  };

  // const handleNewTagKeyDown = (e: React.KeyboardEvent) => {
  //   if (e.key === "Enter" || e.key === "NumpadEnter") {
  //     e.preventDefault();

  //     if (newTag.trim() !== "") {
  //       setTags([...tags, newTag.trim()]);
  //       setNewTag("");
  //       if (errors.tags) setErrors((prev) => ({ ...prev, tags: false }));
  //     }
  //   } else if (e.key === ",") {
  //     e.preventDefault();

  //     let trimmedTag = newTag.trim();
  //     if (trimmedTag.endsWith(",")) {
  //       trimmedTag = trimmedTag.slice(0, -1).trim();
  //     }
  //     if (trimmedTag !== "") {
  //       setTags([...tags, trimmedTag]);
  //       setNewTag("");
  //       if (errors.tags) setErrors((prev) => ({ ...prev, tags: false }));
  //     }
  //   }
  // };
  const handleNewTagKeyDown = (e: React.KeyboardEvent) => {
    console.log("handleNewTagKeyDown(e) called");
    console.log("e :", e);
    console.log("e.key :", e.key);
    console.log("e.target: ", e?.target);

    const targetKey = e.target as HTMLInputElement;


    if (
      (e.key === "Enter" || e.key === "NumpadEnter") &&
      e.nativeEvent.isComposing === false &&
      newTag.trim() !== ""
    ) {
      e.preventDefault();
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      if (errors.tags) setErrors((prev) => ({ ...prev, tags: false }));
    } else if (targetKey.value === ",") {
      e.preventDefault();
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      if (errors.tags) setErrors((prev) => ({ ...prev, tags: false }));
    } else if (e.key === ",") {
      e.preventDefault();
      let trimmedTag = newTag.trim();
      if (trimmedTag.endsWith(",")) {
        trimmedTag = trimmedTag.slice(0, -1).trim();
      }
      if (trimmedTag !== "") {
        setTags([...tags, trimmedTag]);
        setNewTag("");
        if (errors.tags) setErrors((prev) => ({ ...prev, tags: false }));
      }
    }
  };

  const handleBadgeClick = (clickedTag: string) => {
    setTags(tags.filter((tag) => tag !== clickedTag));
  };

  return (
    <>
      <p className="text-3xl font-bold mt-8">면접 후기 작성</p>
      <form onSubmit={onSubmit} className="flex flex-col w-full mt-2">
        <input
          type="text"
          placeholder="제목에 핵심 내용을 요약해 보세요"
          onChange={handleTitle}
          value={title}
          className="p-2 border border-gray-300 rounded-md mb-4 text-lg focus:outline-none"
        />
        <div className="mb-4">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              className="mr-1 cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={() => handleBadgeClick(tag)}
            >
              #{tag}
            </Badge>
          ))}
          <input
            type="text"
            value={newTag}
            onChange={handleNewTagChange}
            // onKeyUp={handleNewTagKeyDown}
            onKeyDown={handleNewTagKeyDown}
            placeholder="태그를 입력하세요"
            className="w-2/3 border-none focus:outline-none"
          />
        </div>
        <textarea
          placeholder={`[면접 후기 내용 작성 가이드]\n\n - 면접 질문\n - 면접 답변 혹은 면접 느낌\n - 발표 시기`}
          onChange={handleContent}
          value={content}
          className="p-2 resize-none border border-gray-300 rounded-md mb-4 h-80 focus:outline-none"
        />
        {errors.title && <p className="text-sm text-red-500 pl-2 mb-2">제목을 입력해주세요.</p>}
        {errors.content && <p className="text-sm text-red-500 pl-2 mb-2">내용을 입력해주세요.</p>}
        {errors.tags && (
          <p className="text-sm text-red-500 pl-2 mb-4">태그를 하나 이상 추가해주세요.</p>
        )}
        <button type="submit" className="bg-black text-white font-bold py-2 px-4 rounded">
          등록
        </button>
      </form>
    </>
  );
}

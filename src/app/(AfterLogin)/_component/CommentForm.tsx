"use client";

import { Button } from "@/components/ui/button";
import { ChangeEvent, FormEvent, useState } from "react";
import postComment from "../community/_lib/postComment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { userIdState } from "@/store/auth";

export default function CommentForm({ postId }: { postId: string }) {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const userId = useRecoilValue(userIdState);

  const commentData = useMutation({
    mutationKey: ["community", postId.toString(), "comments"],
    mutationFn: (newComment: { content: string; postId: string; userId: number }) =>
      postComment(newComment),
    onSuccess: () => {
      // queryClient.setQueryData<Comment[]>(
      //   ["community", postId.toString(), "comments"],
      //   (oldComments = []) => [
      //     {
      //       commentId: data.commentId,
      //       userId: data.userId,
      //       username: data.username,
      //       postId: data.postId,
      //       content: data.content,
      //       createdAt: data.createdAt,
      //       image: data.image,
      //     } as Comment,
      //     ...oldComments,
      //   ],
      // );
      queryClient.invalidateQueries({ queryKey: ["community", postId.toString(), "comments"] });
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) {
      return;
    }

    commentData.mutate({
      content,
      postId,
      userId,
    });
    setContent("");
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  return (
    <form onSubmit={onSubmit} className="bottom-1 flex p-4 border border-gray-300 rounded-md">
      <input
        type="text"
        value={content}
        onChange={onChange}
        placeholder="댓글을 작성해주세요."
        className="flex-1 w-full h-full focus:outline-none"
      />
      <Button type="submit">등록</Button>
    </form>
  );
}

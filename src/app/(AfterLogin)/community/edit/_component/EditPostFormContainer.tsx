"use client";

import { Post } from "@/model/Post";
import { useQuery } from "@tanstack/react-query";
import getPostDetail from "../../_lib/getPostDetail";
import EditPostForm from "./EditPostForm";

export default function EditPostFormContainer({ postId }: { postId: string }) {
  const { data: post } = useQuery<Post, Object, Post, [_1: string, _2: string]>({
    queryKey: ["community", postId],
    queryFn: ({ queryKey }) => getPostDetail({ queryKey }),
  });

  if (!post) return null;

  return <EditPostForm post={post} />;
}

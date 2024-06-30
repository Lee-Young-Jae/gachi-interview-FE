"use client";

import { Post } from "@/model/Post";
import { useQuery } from "@tanstack/react-query";
import PostDetail from "../../../_component/PostDetail";
import getPostDetail from "../../../_lib/getPostDetail";

export default function GetStudyDetail({ postId }: { postId: string }) {
  const { data: post } = useQuery<Post, Object, Post, [_1: string, _2: string]>({
    queryKey: ["community", postId],
    queryFn: ({ queryKey }) => getPostDetail({ queryKey }),
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
  });

  if (!post) return null;

  return <PostDetail post={post} />;
}

import { useEffect, useState } from "react";
import CommentForm from "@/app/(AfterLogin)/_component/CommentForm";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/model/Post";
import { AiOutlineLike, AiOutlineShareAlt } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { formatRelativeTime } from "@/lib/utils/days";
import { Button } from "@/components/ui/button";
import "./PostDetail.css";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import { accessTokenState, userIdState } from "@/store/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import postLike from "../_lib/postLike";
import { toast } from "react-toastify";
import { PiPencil } from "react-icons/pi";
import { RiDeleteBinLine } from "react-icons/ri";
import Modal from "@/components/Modal";
import { useModal } from "@/components/Modal/useModal";
import deletePost from "../_lib/deletePost";
import { useRouter } from "next/navigation";
import { convertLinks } from "../_lib/convertLinks";
import DOMPurify from "dompurify";

export default function PostDetail({ post }: { post: Post }) {
  const [isLiked, setIsLiked] = useState(post.liked);
  const [animate, setAnimate] = useState(false);
  const [convertedContent, setConvertedContent] = useState("");
  const { openModal, closeModal } = useModal();
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState);
  const userId = useRecoilValue(userIdState);
  const queryClient = useQueryClient();
  const postId = post.postId;
  const content = post.content;

  useEffect(() => {
    const sanitizedContent = DOMPurify.sanitize(convertLinks(content));
    setConvertedContent(sanitizedContent);
  }, [content]);

  const { mutate } = useMutation({
    mutationFn: (params: { userId: number; postId: string; accessToken: string }) =>
      postLike(params),
    onMutate: async () => {
      const queryKey = ["community", postId.toString()];
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: { numOfLike: number; liked: boolean }) => {
        return {
          ...old,
          numOfLike: old.numOfLike,
          liked: old.liked,
        };
      });
      return { previousData };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["community", postId.toString()],
        (old: { numOfLike: number; liked: boolean }) => ({
          ...old,
          numOfLike: data.numOfLike,
          liked: data.liked,
        }),
      );
    },
  });

  const removePost = useMutation({
    mutationKey: ["community", postId],
    mutationFn: (removedPost: { userId: number; postId: string }) => deletePost(removedPost),
    onMutate: async (removedPost) => {
      const previousData = queryClient.getQueryData(["community", postId]);
      if (!previousData) return;

      queryClient.setQueryData(["community", postId], (old: Post[]) => {
        return old.filter((post: { postId: string }) => post.postId !== removedPost.postId);
      });
      return { previousData };
    },
  });

  const handleLike = () => {
    if (!isLiked) {
      mutate({
        userId,
        postId,
        accessToken,
      });
      setIsLiked(true);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
    } else {
      mutate({
        userId,
        postId,
        accessToken,
      });
      setIsLiked(false);
    }
  };

  const handleCopyClipBoard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.info("클립보드에 주소가 복사되었습니다!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (e) {
      toast.error("복사에 실패하였습니다.");
    }
  };

  const handleDeletePost = () => {
    removePost.mutate({
      userId,
      postId,
    });
    closeModal();
    router.push(`/community?tab=${post.category}`);
  };

  const handleOpenDeleteModal = () => {
    openModal(
      <Modal
        header="게시글 삭제"
        disableBackdropClick={false}
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={closeModal} variant="outline">
              취소
            </Button>
            <Button onClick={handleDeletePost} variant="destructive">
              삭제
            </Button>
          </div>
        }
      >
        <p>정말로 삭제하시겠습니까?</p>
      </Modal>,
    );
  };

  return (
    <div className="flex-col">
      <div className="px-6 pt-4 pb-2 mb-5 border border-gray-300 rounded-md">
        <span className="text-2xl font-bold">{post.postTitle}</span>
        <hr className="mt-2" />
        <div className="flex">
          <div
            className="my-5 pb-8 whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: convertedContent }}
          />
          {post.userId == userId && (
            <div className="flex justify-end mt-2 ml-auto">
              <Button
                onClick={() =>
                  router.push(`/community/edit?tab=${post.category}&id=${post.postId}`)
                }
                variant="link"
                className="text-gray-600"
              >
                <PiPencil />
                수정
              </Button>
              <Button onClick={handleOpenDeleteModal} variant="link" className="text-red-500">
                <RiDeleteBinLine />
                삭제
              </Button>
            </div>
          )}
        </div>
        {post.tag.map((tag, index) => (
          <Badge
            key={index}
            className={`px-3 py-1 text-sm ${index === 0 ? "-ml-2" : "mx-1"}`}
            variant="secondary"
          >
            #{tag}
          </Badge>
        ))}
        <div className="flex my-3">
          <div className="flex items-center flex-1 mt-2">
            <img
              src={post.image}
              alt="프로필이미지"
              className="rounded-full"
              width={20}
              height={20}
            />
            <p className="text-gray-600 text-sm ml-2 hidden md:block">
              <span className="font-semibold">{post.userName}</span> •{" "}
              {formatRelativeTime(post.time.toLocaleString())}
            </p>
            <p className="flex-col text-gray-600 text-sm ml-2 md:hidden">
              <p className="font-semibold">{post.userName}</p>
              <p>{formatRelativeTime(post.time.toLocaleString())}</p>
            </p>
          </div>
          <div className="flex">
            <div className="flex items-center w-full justify-center">
              <Button
                variant="outline"
                onClick={handleLike}
                className={`${animate ? "animate-ping" : ""}`}
              >
                <AiOutlineLike className={`mr-1 ${isLiked ? "text-green-500" : "text-gray-500"}`} />
                <span
                  className={`text-sm ${
                    isLiked ? "text-green-500 font-semibold" : "text-gray-700"
                  }`}
                >
                  {post.numOfLike}
                </span>
              </Button>
              <Button
                variant="outline"
                className="ml-2"
                onClick={() => handleCopyClipBoard(window.location.href)}
              >
                <AiOutlineShareAlt className="mr-2" />
                공유
              </Button>
            </div>
            <div className="flex items-center ml-3">
              <FaRegComment className="text-gray-500 mr-1" />
              <span className="text-gray-700 text-sm">{post.numOfComment}</span>
            </div>
          </div>
        </div>
      </div>
      <CommentForm postId={post.postId} />
    </div>
  );
}

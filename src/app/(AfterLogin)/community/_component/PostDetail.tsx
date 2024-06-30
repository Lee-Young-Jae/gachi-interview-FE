import { useEffect, useState } from "react";
import CommentForm from "@/app/(AfterLogin)/_component/CommentForm";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/model/Post";
import { AiOutlineLike, AiOutlineShareAlt } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { formatRelativeTime } from "@/lib/utils/days";
import { Button } from "@/components/ui/button";
import "./PostDetail.css";
import { useRecoilValue } from "recoil";
import { userIdState } from "@/store/auth";
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
  const userId = useRecoilValue(userIdState);
  const queryClient = useQueryClient();
  const postId = post.postId;
  const content = post.content;

  // 게시글 내용을 변환하고 새로운 상태로 설정합니다.
  useEffect(() => {
    const sanitizedContent = DOMPurify.sanitize(convertLinks(content));
    setConvertedContent(sanitizedContent);
  }, [content]);

  // 좋아요 기능을 위한 useMutation 훅을 설정합니다.
  const { mutate: likePost } = useMutation({
    mutationFn: (params: { userId: number; postId: string }) => postLike(params),
    onMutate: async () => {
      // 좋아요 실행 전에 쿼리를 취소하고 이전 데이터를 백업합니다.
      const queryKey = ["community", postId.toString()];
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      // 데이터를 업데이트합니다.
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
      // 성공 시 새로운 좋아요 데이터로 상태를 업데이트합니다.
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

  // 게시글 삭제 기능을 위한 useMutation 훅을 설정합니다.
  const removePost = useMutation({
    mutationKey: ["community", postId],
    mutationFn: (removedPost: { userId: number; postId: string }) => deletePost(removedPost),
    onMutate: async (removedPost) => {
      // 삭제 전에 이전 데이터를 백업합니다.
      const previousData = queryClient.getQueryData(["community", postId]);
      if (!previousData) return;

      // 삭제된 게시글을 쿼리 데이터에서 필터링하여 업데이트합니다.
      queryClient.setQueryData(["community", postId], (old: Post[]) => {
        return old.filter((post: { postId: string }) => post.postId !== removedPost.postId);
      });
      return { previousData };
    },
  });

  // 좋아요 버튼 클릭 처리 함수입니다.
  const handleLike = () => {
    if (!isLiked) {
      // 좋아요 추가
      likePost({
        userId,
        postId,
      });
      setIsLiked(true);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
    } else {
      // 좋아요 취소
      likePost({
        userId,
        postId,
      });
      setIsLiked(false);
    }
  };

  // 클립보드에 링크 복사 처리 함수입니다.
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

  // 게시글 삭제 처리 함수입니다.
  const handleDeletePost = () => {
    removePost.mutate({
      userId,
      postId,
    });
    closeModal();
    router.push(`/community?tab=${post.category}`);
  };

  // 삭제 모달을 열기 위한 함수입니다.
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

  // 좋아요 및 공유 버튼을 렌더링하는 함수입니다.
  const renderButtons = () => (
    <div className="flex items-center justify-center md:justify-start gap-4 hidden md:block">
      <Button variant="outline" onClick={handleLike} className={`${animate ? "animate-ping" : ""}`}>
        <AiOutlineLike className={`mr-1 ${isLiked ? "text-green-500" : "text-gray-500"}`} />
        <span className={`text-sm ${isLiked ? "text-green-500 font-semibold" : "text-gray-700"}`}>
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
  );

  // 모바일에서 좋아요 및 공유 버튼을 렌더링하는 함수입니다.
  const renderMobileButtons = () => (
    <div className="flex items-center justify-center mt-5 mb-3 md:hidden">
      <Button variant="outline" onClick={handleLike} className={`${animate ? "animate-ping" : ""}`}>
        <AiOutlineLike className={`mr-1 ${isLiked ? "text-green-500" : "text-gray-500"}`} />
        <span className={`text-sm ${isLiked ? "text-green-500 font-semibold" : "text-gray-700"}`}>
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
  );

  // 게시글 정보를 렌더링하는 함수입니다.
  const renderPostInfo = () => (
    <div className="px-6 pt-4 pb-2 mb-5 border border-gray-300 rounded-md">
      <span className="text-2xl font-bold">{post.postTitle}</span>
      <hr className="mt-2" />
      <div
        className="my-5 pb-8 whitespace-pre-line break-words"
        dangerouslySetInnerHTML={{ __html: convertedContent }}
      />
      {post.tag.map((tag, index) => (
        <Badge
          key={index}
          className={`px-3 py-1 text-sm ${index === 0 ? "-ml-2" : "mx-1"}`}
          variant="secondary"
        >
          #{tag}
        </Badge>
      ))}
      {post.userId == userId && (
        <div className="flex justify-start mt-4 mb-8 gap-4">
          <button
            onClick={() => router.push(`/community/edit?tab=${post.category}&id=${post.postId}`)}
            className="text-gray-600
            hover:underline"
          >
            <p className="flex items-center">
              <PiPencil />
              <p className="text-sm font-medium pl-1">수정</p>
            </p>
          </button>
          <button onClick={handleOpenDeleteModal} className="text-red-500">
            <p className="flex items-center hover:underline">
              <RiDeleteBinLine />
              <p className="text-sm font-medium pl-1">삭제</p>
            </p>
          </button>
        </div>
      )}
      <div className="flex items-center mt-6 mb-3">
        <div className="flex-1">
          <div className="flex">
            <img
              src={post.image}
              alt="프로필이미지"
              className="rounded-full"
              width={20}
              height={20}
            />
            <p className="text-gray-600 text-sm ml-2">
              <span className="font-semibold">{post.userName}</span> •{" "}
              {formatRelativeTime(post.time.toLocaleString())}
            </p>
          </div>
        </div>
        <div className="flex">
          {renderButtons()}
          <div className="flex items-center ml-3">
            <FaRegComment className="text-gray-500 mr-1" />
            <span className="text-gray-700 text-sm">{post.numOfComment}</span>
          </div>
        </div>
      </div>
      {renderMobileButtons()}
    </div>
  );

  return (
    <div className="flex-col">
      {renderPostInfo()}
      <CommentForm postId={post.postId} />
    </div>
  );
}

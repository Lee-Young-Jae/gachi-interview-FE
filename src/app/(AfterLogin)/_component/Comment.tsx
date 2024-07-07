import { useModal } from "@/components/Modal/useModal";
import { formatRelativeTime } from "@/lib/utils/days";
import { Comment as IComment } from "@/model/Comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { PiPencil } from "react-icons/pi";
import { RiDeleteBinLine } from "react-icons/ri";
import Modal from "@/components/Modal";
import deleteComment from "../community/_lib/deleteComment";
import { useRecoilValue } from "recoil";
import { userIdState } from "@/store/auth";
import patchComment from "../community/_lib/patchComment";

const Comment = forwardRef<HTMLDivElement, { comment: IComment; postId: string }>(
  ({ comment, postId }, ref) => {
    const [isEditing, setIsEditing] = useState(false);
    const { openModal, closeModal } = useModal();
    const [editedComment, setEditedComment] = useState(comment.content);
    const queryClient = useQueryClient();
    const userId = useRecoilValue(userIdState);

    const updateComment = useMutation({
      mutationKey: ["community", postId, "comments"],
      mutationFn: (updatedComment: {
        content: string;
        userId: number;
        commentId: number;
        postId: string;
      }) => patchComment(updatedComment),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["community", postId, "comments"],
        });
      },
    });

    const removeComment = useMutation({
      mutationKey: ["community", postId, "comments"],
      mutationFn: (removedComment: { userId: number; commentId: number; postId: string }) =>
        deleteComment(removedComment),
      onMutate: async (removedComment) => {
        const previousData = queryClient.getQueryData(["community", postId, "comments"]);
        if (!previousData) return;

        queryClient.setQueryData(["community", postId, "comments"], (old: IComment[]) => {
          return old.filter(
            (comment: { commentId: number }) => comment.commentId !== removedComment.commentId,
          );
        });
        return { previousData };
      },
    });

    const handleDeleteComment = () => {
      removeComment.mutate({
        userId: comment.userId,
        commentId: comment.commentId,
        postId,
      });
      closeModal();
    };

    const handleOpenDeleteModal = () => {
      openModal(
        <Modal
          header="댓글 삭제"
          disableBackdropClick={false}
          footer={
            <div className="flex justify-end gap-2">
              <Button onClick={closeModal} variant="outline">
                취소
              </Button>
              <Button onClick={handleDeleteComment} variant="destructive">
                삭제
              </Button>
            </div>
          }
        >
          <p>정말로 삭제하시겠습니까?</p>
        </Modal>,
      );
    };

    const handleUpdateComment = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      updateComment.mutate({
        userId: comment.userId,
        commentId: comment.commentId,
        content: editedComment,
        postId,
      });
      setIsEditing(false);
    };

    return (
      <div ref={ref} className="flex flex-col my-5 p-4 border-b border-gray-300 comment">
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={comment.image}
            alt="프로필이미지"
          />
          <div className="flex flex-col ml-4">
            <span className="font-bold">{comment.username}</span>
            <span className="text-gray-500">
              {formatRelativeTime(comment.createdAt?.toLocaleString())}
            </span>
          </div>
          {comment?.userId == userId && isEditing == false && (
            <div className="flex justify-end mt-2 gap-4 md:gap-6 md:px-6 ml-auto">
              <button onClick={() => setIsEditing(true)} className="text-gray-600 hover:underline">
                <p className="flex items-center">
                  <PiPencil />
                  <p className="text-sm font-medium pl-1">수정</p>
                </p>
              </button>
              <button onClick={handleOpenDeleteModal} className="text-red-500 hover:underline">
                <p className="flex items-center">
                  <RiDeleteBinLine />
                  <p className="text-sm font-medium pl-1">삭제</p>
                </p>
              </button>
            </div>
          )}
        </div>
        {isEditing ? (
          <form onSubmit={handleUpdateComment} className="mt-4">
            <textarea
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              className="w-full h-20 p-4 rounded-md border border-gray-300 resize-none focus:outline-none"
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button onClick={() => setIsEditing(false)} variant="outline">
                취소
              </Button>
              <Button type="submit" variant="default">
                등록
              </Button>
            </div>
          </form>
        ) : (
          <p className="mt-6 ml-1">{comment.content}</p>
        )}
      </div>
    );
  },
);

Comment.displayName = "Comment";

export default Comment;

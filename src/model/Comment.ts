export interface Comment {
  postId?: string;
  videoId?: string;
  commentId: number;
  userId: number;
  userName: string;
  image: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

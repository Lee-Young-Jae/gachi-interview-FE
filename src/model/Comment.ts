export interface Comment {
  postId?: string;
  videoId?: string;
  commentId: number;
  userId: number;
  username: string;
  image: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

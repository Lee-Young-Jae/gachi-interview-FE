export interface Post {
  postId: string;
  userId: number;
  userName: string;
  image: string;
  postTitle: string;
  content: string;
  category: string;
  time: Date;
  updateTime: Date;
  numOfLike: number;
  liked: boolean;
  numOfComment: number;
  tag: string[];
}
export interface PostContent {
  content: Post[];
  totalPages: number;
}

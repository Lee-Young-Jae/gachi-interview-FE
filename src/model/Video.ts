export interface Video {
  videoId: string;
  userId: number;
  userName: string;
  image: string;
  videoTitle: string;
  videoLink: string;
  thumbnailLink: string;
  numOfLike: number;
  exposure: boolean;
  time: string;
  tags: string[];
  liked: boolean;
}

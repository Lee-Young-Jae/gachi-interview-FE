import { Post } from "@/model/Post";
import { useSearchParams } from "next/navigation";
import PostUpdater from "../../_component/PostUpdater";

export default function EditPostForm({ post }: { post: Post }) {
  const category = useSearchParams().get("tab");

  if (!category) return null;

  return (
    <PostUpdater
      initialTitle={post.postTitle}
      initialContent={post.content}
      initialTags={post.tag}
      postId={post.postId}
      category={category}
      isEditing={true}
    />
  );
}

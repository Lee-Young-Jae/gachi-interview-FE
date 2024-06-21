import { useSearchParams } from "next/navigation";
import PostUpdater from "../../_component/PostUpdater";

export default function StudyPostForm() {
  const category = useSearchParams().get("tab");

  if (!category) return null;

  return <PostUpdater category={category} isEditing={false} />;
}

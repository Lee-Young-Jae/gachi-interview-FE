/**
 * "2024-01-01 15:30:00" 형식의 시간을 "5분 전", "1시간 전", "1일 전" 과 같은 상대적인 시간으로 변환합니다.
 */
export const formatRelativeTime = (time: string) => {
  // 3일이 지나면 2024. 1. 1. 형식으로 표시
  const MAX_DIFF = 3 * 24 * 3600 * 1000;

  const currentTime = new Date();
  const targetTime = new Date(time);
  const diff = currentTime.getTime() - targetTime.getTime();
  const diffMinutes = Math.floor(diff / 60000);
  const diffHours = Math.floor(diff / 3600000);
  if (diffMinutes < 1) {
    return "방금 전";
  } else if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }
  if (diff < MAX_DIFF) {
    return `${Math.floor(diffHours / 24)}일 전`;
  }
  return `${targetTime.getFullYear()}. ${targetTime.getMonth() + 1}. ${targetTime.getDate()}.`;
};

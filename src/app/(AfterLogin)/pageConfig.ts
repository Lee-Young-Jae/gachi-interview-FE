type pageRoute =
  | "/interview/setting"
  | "/interview/record"
  | "/videos"
  | "/community"
  | "/my"
  | "/alerts";

const pageConfig: Record<
  pageRoute,
  { title: string; description: string; showLayout: boolean; root: string }
> = {
  "/interview/setting": {
    title: "녹화 설정",
    description: "면접 전 스크립트와 카메라 설정을 확인해보세요.",
    showLayout: true,
    root: "interview",
  },
  "/interview/record": {
    title: "면접 녹화",
    description: "같이 면접! 당신의 면접을 응원합니다.",
    showLayout: false,
    root: "interview",
  },
  "/videos": {
    title: "면접 영상 목록",
    description: "영상을 공유하고 다른 사람의 피드백을 받아보세요.",
    showLayout: true,
    root: "videos",
  },
  "/community": {
    title: "커뮤니티",
    description: "같이 면접하는 사람들과 소통하세요.",
    showLayout: true,
    root: "community",
  },
  "/my": {
    title: "마이페이지",
    description: "나의 면접 영상을 확인하고 관리하세요.",
    showLayout: true,
    root: "my",
  },
  "/alerts": {
    title: "알림",
    description: "새로운 소식을 확인하세요.",
    showLayout: true,
    root: "alerts",
  },
};

export const defaultConfig = {
  title: "같이면접",
  description: "같이 면접 준비하는 서비스.",
  showLayout: true,
};

// path경로를 받아 해당하는 페이지의 정보를 반환
export const getPageConfig = (path: string) => {
  const page = Object.keys(pageConfig).find((key) => path.startsWith(key));
  return pageConfig[page as pageRoute] || defaultConfig;
};

export default pageConfig;

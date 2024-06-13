import { deleteCookie } from "cookies-next";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const originalRequest = async (url: string, config: RequestInit) => {
  try {
    url = `${BASE_URL}${url}`;
    let response = await fetch(url, config);
    let data = null;

    console.log(url);

    if (response.ok && response.headers.get("Content-Type")?.includes("application/json")) {
      console.log("response.json()");
      data = await response.json();
    } else {
      console.log("response.text()");
      data = await response.text();
    }

    console.log("REQUESTING: ", data);
    console.log("originalRequest의 response", response);
    return { response, data };
  } catch (error) {
    console.error("originalRequest 에러:", error);
    throw error;
  }
};

const showLoginToast = () => {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);
  overlay.style.display = "block";

  toast.warning("토큰이 만료되었습니다.\n잠시 후 로그인 페이지로 이동합니다.", {
    position: "top-center",
    autoClose: 8000,
    className: "toast-message",
  });

  localStorage.clear();
  deleteCookie("accessToken");
  setTimeout(() => {
    window.location.href = "/";
  }, 8000);
};

const refreshingToken = async (url: string, accessToken: string, config: RequestInit) => {
  const refreshToken = localStorage.getItem("refreshToken")
    ? JSON.parse(localStorage.getItem("refreshToken") as string)
    : null;

  if (!refreshToken) {
    throw new Error("사용 가능한 리프레시 토큰이 없습니다.");
  }

  console.log("refreshing token 과정이 시작됩니다.");
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${accessToken}`,
    RefreshToken: `Bearer ${refreshToken}`,
  };

  console.log("RefreshToken header 리프레시 토큰 추가 완료.");

  try {
    console.log("refreshingToken 함수 try문 시작");
    let { response } = await originalRequest(url, config);

    let newAccessToken = response.headers.get("Authorization");
    if (newAccessToken) {
      newAccessToken = newAccessToken.replace("Bearer ", "");
      console.log("newAccessToken", newAccessToken);
      localStorage.setItem("accessToken", JSON.stringify(newAccessToken));
      return newAccessToken;
    } else {
      throw new Error("새로운 엑세스 토큰을 가져오는데 실패했습니다.");
    }
  } catch (error) {
    console.error("refreshingToken 에러:", error);
    throw error;
  }
};

const customFetcher = async (url: string, config: RequestInit) => {
  let accessToken = localStorage.getItem("accessToken")
    ? JSON.parse(localStorage.getItem("accessToken") as string)
    : null;

  if (!accessToken) {
    return { response: null, data: null };
  }

  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  console.log("Before Request");
  let { response, data } = await originalRequest(url, config);
  console.log("After Request");

  if (response.status === 401) {
    console.log("accessToken 만료, 리프레시를 시작합니다.");
    try {
      accessToken = await refreshingToken(url, accessToken, config);

      if (accessToken) {
        console.log("새로 발급 된 accessToken", accessToken);
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        };
        const retryResponse = await originalRequest(url, config);
        response = retryResponse.response;
        data = retryResponse.data;
      } else {
        showLoginToast();
        throw new Error("리프레시 토큰을 가져오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("refreshing token in customFetcher 에러:", error);
      showLoginToast();
      throw error;
    }
  }

  return { response, data };
};

export default customFetcher;

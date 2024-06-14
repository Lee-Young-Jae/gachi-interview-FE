"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "firebase/messaging";
import { messaging, isSupportedBrowser } from "@/firebase";
import { useSetRecoilState } from "recoil";
import { accessTokenState, refreshTokenState, userIdState } from "@/store/auth";
import { setCookie } from "cookies-next";

export default function KakaoAuth2Redirect() {
  const [code, setCode] = useState<string | null>(null);
  const setAccessToken = useSetRecoilState(accessTokenState);
  const setRefreshToken = useSetRecoilState(refreshTokenState);
  const setUserId = useSetRecoilState(userIdState);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URL(window.location.href);
      const receivedCode = urlParams.searchParams.get("code");
      if (receivedCode) {
        setCode(receivedCode);
      }
    }
  }, []);

  useEffect(() => {
    if (code) {
      const kakaoLogin = async () => {
        try {
          const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
          const res = await fetch(`${BASE_URL}/user/kakao/login?code=${code}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (res.status === 201) {
            console.log("로그인 성공");
            const data = await res.json();

            setCookie("accessToken", data.accessToken, { secure: true });
            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            setUserId(data.userId);

            const fetchFcmToken = async () => {
              try {
                // 06.04 임시로 작성했습니다. 사용자가 브라우저에서 알림을 허용했는지 확인하는 코드
                console.log("브라우저 지원 여부:", await isSupportedBrowser);

                // 여기까지

                const newToken = await getToken(messaging, {
                  vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
                });
                console.log("FCM 토큰 가져옴:", newToken);

                try {
                  const tokenRes = await fetch(`${BASE_URL}/user/fcm/token`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${data.accessToken}`,
                    },
                    body: JSON.stringify({ fcmToken: newToken }),
                  });

                  if (tokenRes.status === 200 || tokenRes.status === 201) {
                    console.log("FCM 토큰 전송 성공");
                    router.replace("/my?tab=videos");
                  } else {
                    console.error("FCM 토큰 전송 실패:", tokenRes.status);
                  }
                } catch (tokenError) {
                  console.error("FCM 토큰 전송 중 오류 발생:", tokenError);
                }
              } catch (error) {
                console.error("FCM 토큰을 가져오는 중 오류 발생:", error);
              }
            };

            fetchFcmToken();
          } else {
            console.error("예상치 못한 응답 상태:", res.status);
          }
        } catch (error) {
          console.log(error);
        }
      };

      kakaoLogin();
    }
  }, [code, router, setAccessToken, setRefreshToken, setUserId]);

  return null;
}

"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { userIdState } from "@/store/auth";
import customFetcher from "@/lib/utils/customFetcher";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { formatRelativeTime } from "@/lib/utils/days";
import NoData from "../_component/NoData";

type alertsData = {
  content: string;
  createdAt: Date;
};

export default function Alerts() {
  const [alertsData, setAlertsData] = useState<alertsData[]>([]);
  const userId = useRecoilValue(userIdState);

  const fetchData = async () => {
    try {
      const { response, data } = await customFetcher(`/user/${userId}/notice`);

      if (!response?.ok) {
        throw new Error("Failed to fetch data");
      }

      setAlertsData(data);
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">새로운 알림</h2>
      {alertsData.length > 0 ? (
        alertsData.map((alert, index) => (
          <article key={index} className="mb-4">
            <Alert>
              <AlertDescription className="mb-4">{alert.content}</AlertDescription>
              <footer>
                <span className="text-sm text-gray-500">
                  {formatRelativeTime(alert.createdAt.toLocaleString())}
                </span>
              </footer>
            </Alert>
          </article>
        ))
      ) : (
        <NoData message="아직은 도착한 알림이 없네요...😰" />
      )}
    </section>
  );
}

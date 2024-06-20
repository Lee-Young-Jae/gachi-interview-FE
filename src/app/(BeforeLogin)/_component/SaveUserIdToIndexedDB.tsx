import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { userIdState } from "@/store/auth";

export default function SaveUserIdToIndexedDB() {
  const userId = useRecoilValue(userIdState);

  useEffect(() => {
    const request = indexedDB.open("userIdDB", 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore("userIdStore");
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(["userIdStore"], "readwrite");
      const store = transaction.objectStore("userIdStore");
      store.put(userId, "userId");
    };

    request.onerror = () => {
      console.error("IndexedDB access error");
    };
  }, [userId]);

  return null;
}

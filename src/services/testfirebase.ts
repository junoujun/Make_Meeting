import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const testFirebaseConnection = async () => {
  try {
    await setDoc(doc(db, "test", "hello"), {
      message: "Firebase 연결 성공",
      createdAt: new Date().toISOString(),
    });

    alert("Firebase 테스트 저장 완료!");
  } catch (error) {
    console.error("Firebase 연결 실패:", error);
    alert("Firebase 연결 실패! 콘솔을 확인하세요.");
  }
};

// src/components/memberA/Make.tsx (또는 올바른 경로)
import type { PageState } from "../../App";
import DateRangeSelector from "./DateRangeSelector";
import { useState } from "react";
import type { RoomData } from "../../types";

// 💡 Props 타입 정의에 onRoomCreated 함수를 추가합니다!
type MakeProps = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageState>>;
  onRoomCreated: (code: string) => void; 
};

type DateRange = {
  startDate: string;
  endDate: string;
};

export default function Make({ setCurrentPage, onRoomCreated }: MakeProps) {
  const [promiseName, setMedicineName] = useState("");
  const [masterName, setDiseaseName] = useState("");

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "",
    endDate: "",
  });

  const handleCreateRoom = () => {
    if (!promiseName.trim() || !masterName.trim() || !dateRange.startDate || !dateRange.endDate) {
      alert("모든 빈칸과 날짜 범위를 채워주세요!");
      return;
    }

    const roomCode = createRoomCode();

    const roomData: RoomData = {
      roomCode: roomCode,
      title: promiseName,
      creatorName: masterName,
      dateRange: {
        start: dateRange.startDate,
        end: dateRange.endDate,
      },
      participants: [],
      bucketList: [],
    };

    localStorage.setItem(roomData.roomCode, JSON.stringify(roomData));
    console.log(roomData);

    // 💡 [핵심] 방 생성이 성공했음을 부모(App.tsx)에게 알리며 생성된 코드를 넘겨줍니다!
    onRoomCreated(roomCode); 
  };

  const createRoomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    while (true) {
      let code = "";
      for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
      }
      const savedRoom = localStorage.getItem(code);
      if (savedRoom === null) {
        return code;
      }
    }
  };

  return (
    <>
      <button onClick={() => setCurrentPage("Home")}>
        <h1>놀래말래?</h1>
      </button>
      <section>
        <div>
          <label htmlFor="promiseName">약속 이름: </label>
          <input
            id="promiseName"
            type="text"
            value={promiseName}
            onChange={(e) => setMedicineName(e.target.value)}
            placeholder="진짜 밥먹기"
          />
        </div>

        <div>
          <label htmlFor="masterName">방장 이름: </label>
          <input
            id="masterName"
            type="text"
            value={masterName}
            onChange={(e) => setDiseaseName(e.target.value)}
            placeholder="홍길동"
          />
        </div>
      </section>

      <section>
        <DateRangeSelector
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onChangeDateRange={setDateRange}
        />
      </section>

      <button onClick={handleCreateRoom}>방 만들기</button>
    </>
  );
}
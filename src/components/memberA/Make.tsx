import type { PageState } from "../../App";
import DateRangeSelector from "./DateRangeSelector";
import { useState } from "react";
import type { RoomData } from "../../types";

type LoginProps = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageState>>;
};

type DateRange = {
  startDate: string;
  endDate: string;
};

export default function Make({ setCurrentPage }: LoginProps) {
  const [promiseName, setMedicineName] = useState("");
  const [masterName, setDiseaseName] = useState("");

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "",
    endDate: "",
  });

  const handleCreateRoom = () => {
    const roomData: RoomData = {
      roomCode: createRoomCode(),
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

import type { PageState } from "../../App";
import DateRangeSelector from "./DateRangeSelector";
import { useState } from "react";
import type { RoomData } from "../../types";
import { createRoom, getRoom } from "../../services/Roomservice";

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

  const handleCreateRoom = async () => {
    if (
      !promiseName.trim() ||
      !masterName.trim() ||
      !dateRange.startDate ||
      !dateRange.endDate
    ) {
      alert("모든 빈칸과 날짜 범위를 채워주세요!");
      return;
    }

    const roomCode = await createRoomCode();
    const roomData: RoomData = {
      roomCode,
      title: promiseName,
      creatorName: masterName,
      dateRange: { start: dateRange.startDate, end: dateRange.endDate },
      participants: [],
      bucketList: [],
    };

    await createRoom(roomData); //DB 연동으로 변경된 부분
    onRoomCreated(roomCode);
  };

  const createRoomCode = async () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    while (true) {
      let code = "";
      for (let i = 0; i < 4; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
      }

      const existingRoom = await getRoom(code); //DB 연동으로 변경된 부분

      if (existingRoom === null) {
        return code;
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md my-10 space-y-6">
      {/* 상단 내비게이션 */}
      <button
        onClick={() => setCurrentPage("Home")}
        className="group flex items-center gap-1 text-slate-400 hover:text-slate-800 transition-colors"
      >
        <span className="text-sm group-hover:-translate-x-0.5 transition-transform">
          ◀
        </span>
        <span className="text-xs font-bold">홈으로</span>
      </button>

      <div className="space-y-1 border-b border-slate-100 pb-4">
        <h1 className="text-xl font-black text-slate-900">
          ✨ 새로운 약속방 만들기
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          친구들을 초대할 모임의 기본 틀을 생성합니다.
        </p>
      </div>

      {/* 입력 섹션 */}
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="promiseName"
            className="text-xs font-bold text-slate-600"
          >
            📌 약속 이름
          </label>
          <input
            id="promiseName"
            type="text"
            value={promiseName}
            onChange={(e) => setMedicineName(e.target.value)}
            placeholder="예: 종강 기념 삼겹살 파티"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="masterName"
            className="text-xs font-bold text-slate-600"
          >
            👑 방장 이름
          </label>
          <input
            id="masterName"
            type="text"
            value={masterName}
            onChange={(e) => setDiseaseName(e.target.value)}
            placeholder="내 이름 혹은 닉네임"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50"
          />
        </div>
      </div>

      {/* 날짜 범위 컴포넌트 래퍼 */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <DateRangeSelector
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onChangeDateRange={setDateRange}
        />
      </div>

      <button
        onClick={handleCreateRoom}
        className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition-colors active:scale-[0.99]"
      >
        🚀 약속 방 개설하고 초대 코드 받기
      </button>
    </div>
  );
}

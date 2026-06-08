import React, { useState } from "react";
import type { PageState } from "../../App";

type JoinProps = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageState>>;
  onJoinRoom: (code: string) => void | Promise<void>;
};

export default function Join({ setCurrentPage, onJoinRoom }: JoinProps) {
  const [roomCode, setRoomCode] = useState("");

  const handleJoinClick = () => {
    if (!roomCode.trim()) {
      alert("방 코드를 입력해주세요!");
      return;
    }
    onJoinRoom(roomCode.trim().toUpperCase());
  };

  const handleJoinEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!roomCode.trim()) {
        alert("방 코드를 입력해주세요!");
        return;
      }
      onJoinRoom(roomCode.trim().toUpperCase());
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md my-16 space-y-6">
      {/* 상단 뒤로가기 겸 로고 */}
      <button
        onClick={() => setCurrentPage("Home")}
        className="group flex items-center gap-1 text-slate-400 hover:text-slate-800 transition-colors"
      >
        <span className="text-sm group-hover:-translate-x-0.5 transition-transform">
          ◀
        </span>
        <span className="text-xs font-bold">홈으로</span>
      </button>

      <div className="space-y-1">
        <h1 className="text-xl font-black text-slate-900">
          🔑 약속 방 입장하기
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          전달받은 4자리 초대를 입력창에 적어주세요.
        </p>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={roomCode}
          maxLength={4}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="예: X7B9"
          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-black tracking-widest text-slate-800 uppercase focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          onKeyDown={handleJoinEnter}
        />

        <button
          onClick={handleJoinClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-sm transition-colors active:scale-[0.99]"
        >
          입장 완료하기
        </button>
      </div>
    </div>
  );
}

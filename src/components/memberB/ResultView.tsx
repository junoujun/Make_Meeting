import React from "react";
import type { RoomData } from "../../types";
import RankingBoard from "./RankingBoard";
import ParticipantList from "./ParticipantList";
import HeatmapCalendar from "./HeatmapCalendar";

// 1. 부모(App.tsx)로부터 받아올 수정/삭제 관련 Props 타입 정의
interface Props {
  roomData: RoomData;
  mySavedName: string | null; // 내 브라우저에 저장된 내 이름
  onEditParticipant: (name: string) => void; // 수정 버튼 눌렀을 때 실행할 함수
  onDeleteParticipant: (name: string) => void; // 삭제 버튼 눌렀을 때 실행할 함수
}

export default function ResultView({
  roomData,
  mySavedName,
  onEditParticipant,
  onDeleteParticipant,
}: Props) {
  // 2. 구조 분해 할당으로 Props 받기

  return (
    <div className="max-w-5xl mx-auto my-10 px-4">
    
    {/* 💡 결과창 상단 헤더 영역 추가 */}
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800">📊 약속 조율 결과</h2>
        <p className="text-sm text-slate-500 mt-1">{roomData.title}</p>
      </div>
      <div className="bg-slate-900 text-white px-4 py-2 rounded-xl flex flex-col items-end shadow-sm">
        <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider">ROOM CODE</span>
        <span className="text-lg font-black tracking-widest">{roomData.roomCode}</span>
      </div>
    </div>

    {/* 기존의 Flex 박스 영역 */}
    <div className="flex flex-col md:flex-row gap-8 p-6 bg-slate-50/60 rounded-2xl border border-slate-200/80 shadow-sm">
      {/* 왼쪽: 히트맵 달력 */}
      <div className="flex-1 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
        <HeatmapCalendar roomData={roomData} />
      </div>

      {/* 오른쪽: 랭킹 및 인원 현황 */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        <RankingBoard participants={roomData.participants} />
        <ParticipantList 
          participants={roomData.participants} 
          mySavedName={mySavedName}
          onEditParticipant={onEditParticipant}
          onDeleteParticipant={onDeleteParticipant}
        />
      </div>
    </div>

  </div>
  );  
}

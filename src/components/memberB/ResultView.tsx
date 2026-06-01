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
    <div className="flex flex-col md:flex-row gap-8 p-6 max-w-5xl mx-auto bg-slate-50/60 rounded-2xl border border-slate-200/80 shadow-sm my-10">
      {/* 왼쪽: 히트맵 달력 */}
      <div className="flex-1 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
        <HeatmapCalendar roomData={roomData} />
      </div>

      {/* 오른쪽: 랭킹 및 인원 현황 */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        <RankingBoard participants={roomData.participants} />

        {/* 3. 명단 컴포넌트에 내 이름 정보와 수정/삭제 대리인 함수들을 쏙 넘겨줍니다! */}
        <ParticipantList
          participants={roomData.participants}
          mySavedName={mySavedName}
          onEditParticipant={onEditParticipant}
          onDeleteParticipant={onDeleteParticipant}
        />
      </div>
    </div>
  );
}

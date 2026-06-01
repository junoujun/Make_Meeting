// src/components/ResultView.tsx 최종본 예시

import React from "react";
import type { RoomData } from "../../types";
import RankingBoard from "./RankingBoard";
import ParticipantList from "./ParticipantList";
import HeatmapCalendar from "./HeatmapCalendar"; // 1. 달력 컴포넌트 import 추가!

export default function ResultView({ roomData }: { roomData: RoomData }) {
  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 max-w-5xl mx-auto bg-slate-50/60 rounded-2xl border border-slate-200/80 shadow-sm my-10">
      {/* 왼쪽: 히트맵 달력 (조립 완료!) */}
      <div className="flex-1 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
        <HeatmapCalendar roomData={roomData} />
      </div>

      {/* 오른쪽: 랭킹 및 인원 현황 */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        <RankingBoard participants={roomData.participants} />
        <ParticipantList participants={roomData.participants} />
      </div>
    </div>
  );
}

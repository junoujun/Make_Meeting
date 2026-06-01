import React from "react";
import type { RoomData } from "../../types";
import { calculateDateCounts } from "../../utils/dateMemo";

interface Props {
  roomData: RoomData;
}

export default function HeatmapCalendar({ roomData }: Props) {
  const { participants, dateRange } = roomData;
  const totalUsers = participants.length;

  // 1. dateMemo.ts 유틸을 사용해 날짜별 투표수 집계하기
  // 결과 예시: { '2026-06-22': 1, '2026-06-23': 2, '2026-06-24': 3, ... }
  const dateCounts = calculateDateCounts(participants);

  // 2. 2026년 6월 달력 데이터 하드코딩 (방장이 지정한 월에 맞게 최소한으로 구현)
  const year = 2026;
  const month = 6;
  const totalDays = 30; // 6월은 30일까지
  const startDayOfWeek = 1; // 2026년 6월 1일은 월요일 (0:일, 1:월, 2:화...)

  // 요일 헤더 데이터
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

  // 달력 격자를 채우기 위한 배열 생성 (앞의 빈칸 + 1일부터 30일까지)
  const blanks = Array(startDayOfWeek).fill(null);
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  const calendarCells = [...blanks, ...days];

  // 3. 투표수 및 방장 설정 범위에 따라 Tailwind 색상 클래스를 반환하는 함수
  const getCellStyling = (dateStr: string, count: number) => {
    // 방장이 지정한 날짜 범위 내에 있는지 확인
    const isWithinRange =
      dateStr >= dateRange.start && dateStr <= dateRange.end;

    // 범위 밖의 날짜는 비활성화 투명 처리
    if (!isWithinRange) {
      return "bg-gray-50 text-gray-300 opacity-40";
    }

    // 범위 내에 있지만 투표가 0건인 경우
    if (count === 0) {
      return "bg-slate-100 text-slate-400 hover:bg-slate-200/70 cursor-pointer";
    }

    // 투표 비율에 따른 히트맵 색상 분기 (제시해주신 이미지 기준 반영)
    const ratio = count / totalUsers;
    if (ratio === 1) return "bg-slate-900 text-white font-bold shadow-md"; // 3명 전원 (짙은 남색)
    if (ratio >= 0.6) return "bg-blue-600 text-white font-semibold"; // 2명 가능 (중간 파랑)
    return "bg-sky-300 text-sky-950 font-medium"; // 1명 가능 (연한 하늘색)
  };

  return (
    <div className="w-full">
      {/* 달력 상단 안내 및 타이틀 */}
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-slate-800 mb-1">
          종합 최적 날짜 도출
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          3명 전원 가능 ➔{" "}
          <span className="text-slate-900 font-bold">짙은 남색</span> | 2명 가능
          ➔ <span className="text-blue-600 font-bold">중간 파랑</span> | 1명
          가능 ➔ <span className="text-sky-400 font-bold">연한 하늘색</span>
        </p>
      </div>

      {/* 달력 메인 판 */}
      <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
        {/* 월 표시 */}
        <div className="text-center font-bold text-lg text-slate-700 mb-4">
          {year}년 {month}월
        </div>

        {/* 7열 Grid 레이아웃 */}
        <div className="grid grid-cols-7 gap-2 text-center">
          {/* 요일 헤더 렌더링 */}
          {daysOfWeek.map((day, idx) => (
            <div
              key={day}
              className={`py-1 text-xs font-bold ${
                idx === 0
                  ? "text-red-500"
                  : idx === 6
                    ? "text-blue-500"
                    : "text-slate-400"
              }`}
            >
              {day}
            </div>
          ))}

          {/* 날짜 셀 렌더링 */}
          {calendarCells.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="p-2" />; // 빈칸 공백 처리
            }

            // 날짜 비교를 위해 '2026-06-05' 형태로 포맷팅
            const formattedDay = day < 10 ? `0${day}` : `${day}`;
            const dateStr = `${year}-0${month}-${formattedDay}`;
            const count = dateCounts[dateStr] || 0;

            return (
              <div
                key={dateStr}
                className={`p-2 rounded-lg flex flex-col items-center justify-between min-h-[64px] transition-all ${getCellStyling(dateStr, count)}`}
              >
                <span className="text-sm font-medium">{day}</span>
                {/* 투표 수가 있을 때만 밑에 (숫자) 표시 */}
                {count > 0 && (
                  <span className="text-[11px] opacity-90 mt-1 font-bold">
                    ({count})
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

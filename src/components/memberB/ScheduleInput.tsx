import React, { useState } from "react"; // 1. useEffect 임포트 추가!
import type { RoomData } from "../../types";

interface Props {
  roomData: RoomData;
  onSubmitSchedule: (name: string, selectedDates: string[]) => void;
  editingName: string | null;
  mySavedName: string | null;
}

export default function ScheduleInput({ roomData, onSubmitSchedule, editingName, mySavedName }: Props) {
  const { dateRange, title, participants } = roomData;

  // 1. [useEffect 지우기] 대신, 수정 타겟 이름을 먼저 찾습니다.
  const targetName = editingName || mySavedName;
  const existingUser = targetName ? participants.find(p => p.name === targetName) : null;

  // 2. useState 초기값 안에서 바로 데이터를 삼항연산자로 꽂아줍니다!
  // 기존에 저장된 유저가 있으면 그 이름을 쓰고, 없으면 빈 문자열('')을 씁니다.
  const [name, setName] = useState(existingUser ? existingUser.name : '');
  
  // 날짜도 마찬가지로 기존 유저가 있으면 그 일정을, 없으면 빈 배열([])을 씁니다.
  const [selectedDates, setSelectedDates] = useState<string[]>(
    existingUser ? existingUser.availableDates : []
  );
  // 2. 달력 그리기 및 요일 매칭에 필요한 핵심 변수 정의 (6월 기준)
  const year = 2026;
  const month = 6;
  const totalDays = 30;
  const startDayOfWeek = 1; // 2026년 6월 1일은 월요일

  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  const blanks = Array(startDayOfWeek).fill(null);
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  const calendarCells = [...blanks, ...days];


  // 3. 날짜 클릭 시 선택 상태를 토글하는 함수 채워넣기
  const handleDateClick = (dateStr: string, isWithinRange: boolean) => {
    if (!isWithinRange) return;

    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter((d) => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr]);
    }
  };

  // 4. 폼 제출(Submit) 핸들러 함수 채워넣기
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("이름을 입력해 주세요!");
      return;
    }
    if (selectedDates.length === 0) {
      alert("가능한 날짜를 최소 하나 이상 선택해 주세요!");
      return;
    }

    // 부모(App.tsx)로 데이터 전달
    onSubmitSchedule(name.trim(), selectedDates);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm my-10">
      {/* 방 제목 표시 안내 */}
      <div className="mb-6 border-b border-slate-100 pb-4">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          약속 조율 중
        </span>
        <h2 className="text-xl font-extrabold text-slate-800 mt-2">{title}</h2>
        <p className="text-xs text-slate-400 mt-1">
          가능한 날짜를 모두 클릭한 후 제출해 주세요. (중복 선택 가능)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 이름 입력 영역 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700">
            참여자 이름
          </label>
          <input
            type="text"
            placeholder="이름을 입력하세요 (예: 홍길동)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!!editingName || !!mySavedName} // 수정 중일 때는 이름 변경 방지 (보안/데이터 매칭용)
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
          />
        </div>

        {/* 일정 선택 달력 영역 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700">
            가능한 날짜 선택 ({selectedDates.length}개 선택됨)
          </label>

          <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
            <div className="text-center font-bold text-sm text-slate-600 mb-3">
              {year}년 {month}월
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {/* 요일 */}
              {daysOfWeek.map((day, idx) => (
                <div
                  key={day}
                  className={`text-xs font-bold ${idx === 0 ? "text-red-500" : idx === 6 ? "text-blue-500" : "text-slate-400"}`}
                >
                  {day}
                </div>
              ))}

              {/* 날짜 그리드 */}
              {calendarCells.map((day, index) => {
                if (day === null) return <div key={`empty-${index}`} />;

                const formattedDay = day < 10 ? `0${day}` : `${day}`;
                const dateStr = `${year}-0${month}-${formattedDay}`;

                const isWithinRange =
                  dateStr >= dateRange.start && dateStr <= dateRange.end;
                const isSelected = selectedDates.includes(dateStr);

                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={!isWithinRange}
                    onClick={() => handleDateClick(dateStr, isWithinRange)}
                    className={`p-2 rounded-lg text-sm font-semibold flex items-center justify-center min-h-[48px] transition-all ${
                      !isWithinRange
                        ? "bg-transparent text-slate-200 cursor-not-allowed opacity-30"
                        : isSelected
                          ? "bg-blue-600 text-white shadow-sm scale-105"
                          : "bg-white text-slate-700 border border-slate-200 hover:border-blue-400"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 제출 버튼 (수정 여부에 따라 글자 동적 변경) */}
        <button
          type="submit"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors shadow-sm"
        >
          {editingName || mySavedName
            ? "내 일정 수정 완료하기"
            : "내 일정 제출하기"}
        </button>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import type { RoomData } from '../../types';




interface Props {
  roomData: RoomData;
  onSubmitSchedule: (name: string, selectedDates: string[]) => void;
}

export default function ScheduleInput({ roomData, onSubmitSchedule }: Props) {
  const { dateRange, title } = roomData;

  // 컴포넌트 자체에서 관리할 참여자 이름과 선택한 날짜들의 상태(State)
  const [name, setName] = useState('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  // 2026년 6월 달력 기본 정보 (1일=월요일, 총 30일)
  const year = 2026;
  const month = 6;
  const totalDays = 30;
  const startDayOfWeek = 1;

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const blanks = Array(startDayOfWeek).fill(null);
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  const calendarCells = [...blanks, ...days];

  // 날짜 클릭 시 선택 상태를 토글하는 함수
  const handleDateClick = (dateStr: string, isWithinRange: boolean) => {
    if (!isWithinRange) return; // 방장이 정한 범위 밖이면 무시

    if (selectedDates.includes(dateStr)) {
      // 이미 선택된 날짜면 배열에서 제거
      setSelectedDates(selectedDates.filter(d => d !== dateStr));
    } else {
      // 선택 안 된 날짜면 배열에 추가
      setSelectedDates([...selectedDates, dateStr]);
    }
  };

  // 제출 버튼 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('이름을 입력해 주세요!');
      return;
    }
    if (selectedDates.length === 0) {
      alert('가능한 날짜를 최소 하나 이상 선택해 주세요!');
      return;
    }
    
    // 부모 컴포넌트(App.tsx)로 데이터Bottom-Up 전달
    onSubmitSchedule(name.trim(), selectedDates);
    alert('일정 제출이 완료되었습니다!');
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm my-10">
      {/* 방 제목 표시 안내 */}
      <div className="mb-6 border-b border-slate-100 pb-4">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          약속 조율 중
        </span>
        <h2 className="text-xl font-extrabold text-slate-800 mt-2">
          {title}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          가능한 날짜를 모두 클릭한 후 제출해 주세요. (중복 선택 가능)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 이름 입력 영역 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700">참여자 이름</label>
          <input
            type="text"
            placeholder="이름을 입력하세요 (예: 홍길동)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
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
                <div key={day} className={`text-xs font-bold ${idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-slate-400'}`}>
                  {day}
                </div>
              ))}

              {/* 날짜 그리드 */}
              {calendarCells.map((day, index) => {
                if (day === null) return <div key={`empty-${index}`} />;

                const formattedDay = day < 10 ? `0${day}` : `${day}`;
                const dateStr = `${year}-0${month}-${formattedDay}`;
                
                // 방장이 지정한 범위 내에 있는지 확인
                const isWithinRange = dateStr >= dateRange.start && dateStr <= dateRange.end;
                // 현재 사용자가 클릭해서 선택했는지 확인
                const isSelected = selectedDates.includes(dateStr);

                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={!isWithinRange}
                    onClick={() => handleDateClick(dateStr, isWithinRange)}
                    className={`p-2 rounded-lg text-sm font-semibold flex items-center justify-center min-h-[48px] transition-all ${
                      !isWithinRange 
                        ? 'bg-transparent text-slate-200 cursor-not-allowed opacity-30' 
                        : isSelected
                          ? 'bg-blue-600 text-white shadow-sm scale-105'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors text-sm"
        >
          내 일정 제출하기
        </button>
      </form>
    </div>
  );
}
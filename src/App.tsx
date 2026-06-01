// src/App.tsx
import React, { useState } from 'react';
import type { RoomData } from './types';
import ResultView from './components/memberB/ResultView';
import ScheduleInput from './components/memberB/ScheduleInput';

// 1. 공통으로 사용할 가짜 데이터를 대장 파일(App.tsx) 상단에 딱 한 번만 선언합니다.
const mockRoomData: RoomData = {
  roomCode: '1234',
  title: '종강 기념 동기 정기 모임',
  creatorName: '김민준',
  dateRange: {
    start: '2026-06-20',
    end: '2026-06-30'
  },
  participants: [
    { name: '김민준', availableDates: ['2026-06-22', '2026-06-23', '2026-06-24'] },
    { name: '홍길동', availableDates: ['2026-06-23', '2026-06-24', '2026-06-25'] },
    { name: '이영희', availableDates: ['2026-06-24', '2026-06-25', '2026-06-26'] }
  ],
  bucketList: []
};

export default function App() {
  // 현재 어떤 화면을 보여줄지 결정하는 상태 ('INPUT' 또는 'RESULT')
  const [currentStep, setCurrentStep] = useState<'INPUT' | 'RESULT'>('INPUT');
  
  // 가짜 데이터를 상태(State)로 관리하여 실시간 추가 반영이 가능하게 만듭니다.
  const [roomData, setRoomData] = useState<RoomData>(mockRoomData);

  // 참여자가 일정을 제출했을 때 실행될 함수 (Bottom-Up 데이터 수신)
  const handleScheduleSubmit = (name: string, selectedDates: string[]) => {
    const newParticipant = { name, availableDates: selectedDates };
    
    // 기존 참여자 명단에 방금 제출한 사람 누적 추가하기
    setRoomData({
      ...roomData,
      participants: [...roomData.participants, newParticipant]
    });

    // 데이터가 업데이트되면 자동으로 '종합 결과 화면'으로 이동시킴
    setCurrentStep('RESULT');
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      {/* 상단 탭 스위치 (테스트용 간이 버튼) */}
      <div className="max-w-md mx-auto mb-6 flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
        <button
          onClick={() => setCurrentStep('INPUT')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            currentStep === 'INPUT' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          내 일정 입력 탭
        </button>
        <button
          onClick={() => setCurrentStep('RESULT')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            currentStep === 'RESULT' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          종합 결과 확인 탭
        </button>
      </div>

      {/* 상태에 따른 화면 조건부 렌더링 */}
      {currentStep === 'INPUT' ? (
        <ScheduleInput 
          roomData={roomData} 
          onSubmitSchedule={handleScheduleSubmit} 
        />
      ) : (
        <ResultView roomData={roomData} />
      )}
    </div>
  );
}
// src/App.tsx
import React, { useState } from "react";
import type { RoomData } from "./types";
import ResultView from "./components/memberB/ResultView";
import ScheduleInput from "./components/memberB/ScheduleInput";

const INITIAL_ROOM_CODE = '1234';

// [LocalStorage 로드 함수] 브라우저 사물함 검사
const getInitialData = (): RoomData => {
  const saved = localStorage.getItem(INITIAL_ROOM_CODE);
  if (saved) return JSON.parse(saved);
  
  // 가짜 데이터를 다 지우고 싶다면 participants 배열을 []로 비워두면 됩니다!
  return {
    roomCode: INITIAL_ROOM_CODE,
    title: '종강 기념 동기 정기 모임',
    creatorName: '김민준',
    dateRange: { start: '2026-06-20', end: '2026-06-30' },
    participants: [
      { name: '김민준', availableDates: ['2026-06-22', '2026-06-23', '2026-06-24'] },
      { name: '홍길동', availableDates: ['2026-06-23', '2026-06-24', '2026-06-25'] }
    ],
    bucketList: []
  };
};

export default function App() {
  // 1. 화면 전환을 담당하는 스위치 상태 (이게 살아있어야 상단 탭이 작동합니다!)
  const [currentStep, setCurrentStep] = useState<'INPUT' | 'RESULT'>('INPUT');
  const [roomData, setRoomData] = useState<RoomData>(getInitialData);
  const [editingName, setEditingName] = useState<string | null>(null);

  const getMySavedName = () => {
    return localStorage.getItem(`my_name_in_${roomData.roomCode}`);
  };

  // 일정 제출 및 수정 처리
  const handleScheduleSubmit = (name: string, selectedDates: string[]) => {
    let updatedParticipants = [...roomData.participants];

    if (editingName) {
      updatedParticipants = updatedParticipants.map(p => 
        p.name === editingName ? { name, availableDates: selectedDates } : p
      );
    } else {
      if (updatedParticipants.some(p => p.name === name)) {
        alert('이미 존재하는 이름입니다. 수정을 이용해 주세요.');
        return;
      }
      updatedParticipants.push({ name, availableDates: selectedDates });
    }

    const updatedRoomData = { ...roomData, participants: updatedParticipants };
    setRoomData(updatedRoomData);
    
    localStorage.setItem(updatedRoomData.roomCode, JSON.stringify(updatedRoomData));
    localStorage.setItem(`my_name_in_${updatedRoomData.roomCode}`, name);

    setEditingName(null);
    setCurrentStep('RESULT'); // 제출하면 자동으로 결과창 이동
  };

  // 일정 삭제 처리
  const handleScheduleDelete = (nameToDelete: string) => {
    const updatedParticipants = roomData.participants.filter(p => p.name !== nameToDelete);
    const updatedRoomData = { ...roomData, participants: updatedParticipants };

    setRoomData(updatedRoomData);
    localStorage.setItem(updatedRoomData.roomCode, JSON.stringify(updatedRoomData));
    localStorage.removeItem(`my_name_in_${roomData.roomCode}`);
    
    setEditingName(null);
    setCurrentStep('INPUT'); // 삭제하면 다시 입력창으로 이동
  };

  // 수정 모드 시작 처리
  const handleEditStart = (nameToEdit: string) => {
    setEditingName(nameToEdit);
    setCurrentStep('INPUT'); // 수정 누르면 입력창으로 이동
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 font-sans">
      
      {/* 🛠️ 살아난 상단 임시 스위치 탭 영역 */}
      <div className="max-w-md mx-auto mb-8 flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
        <button
          onClick={() => setCurrentStep('INPUT')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
            currentStep === 'INPUT' 
              ? 'bg-slate-900 text-white shadow-sm' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          📝 내 일정 입력 탭
        </button>
        <button
          onClick={() => setCurrentStep('RESULT')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
            currentStep === 'RESULT' 
              ? 'bg-slate-900 text-white shadow-sm' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          📊 종합 결과 확인 탭
        </button>
      </div>

      {/* 메인 화면 조건부 렌더링 */}
      <main className="container mx-auto">
        {currentStep === 'INPUT' ? (
          <ScheduleInput 
            roomData={roomData} 
            onSubmitSchedule={handleScheduleSubmit}
            editingName={editingName}
            mySavedName={getMySavedName()}
          />
        ) : (
          <ResultView 
            roomData={roomData} 
            mySavedName={getMySavedName()}
            onEditParticipant={handleEditStart}
            onDeleteParticipant={handleScheduleDelete}
          />
        )}
      </main>

    </div>
  );
}
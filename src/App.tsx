// src/App.tsx
import React, { useState } from "react";
import type { RoomData } from "./types";
import ResultView from "./components/memberB/ResultView";
import ScheduleInput from "./components/memberB/ScheduleInput";

const INITIAL_ROOM_CODE = "1234";

const getInitialData = (): RoomData => {
  const saved = localStorage.getItem(INITIAL_ROOM_CODE);
  if (saved) return JSON.parse(saved);
  return {
    roomCode: INITIAL_ROOM_CODE,
    title: "종강 기념 동기 정기 모임",
    creatorName: "김민준",
    dateRange: { start: "2026-06-20", end: "2026-06-30" },
    participants: [
      {
        name: "김민준",
        availableDates: ["2026-06-22", "2026-06-23", "2026-06-24"],
      },
      {
        name: "홍길동",
        availableDates: ["2026-06-23", "2026-06-24", "2026-06-25"],
      },
    ],
    bucketList: [],
  };
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<"INPUT" | "RESULT">("INPUT");
  const [roomData, setRoomData] = useState<RoomData>(getInitialData);

  // 현재 수정 중인 사용자의 이름을 기억하는 상태 (null이면 새로 작성 모음)
  const [editingName, setEditingName] = useState<string | null>(null);

  // 로컬스토리지에서 "내가 이 방에 제출했던 이름"을 조회하는 헬퍼 함수
  const getMySavedName = () => {
    return localStorage.getItem(`my_name_in_${roomData.roomCode}`);
  };

  // 1. 일정 제출 및 수정 완료 처리
  const handleScheduleSubmit = (name: string, selectedDates: string[]) => {
    let updatedParticipants = [...roomData.participants];

    if (editingName) {
      // [수정 모드] 기존에 존재하던 이름을 찾아서 날짜만 갱신
      updatedParticipants = updatedParticipants.map((p) =>
        p.name === editingName ? { name, availableDates: selectedDates } : p,
      );
    } else {
      // [새로 작성 모드] 기존 명단에 없으면 새로 추가 (중복 이름 방지는 기본)
      if (updatedParticipants.some((p) => p.name === name)) {
        alert(
          "이미 존재하는 이름입니다. 다른 이름을 사용하거나 수정을 이용해 주세요.",
        );
        return;
      }
      updatedParticipants.push({ name, availableDates: selectedDates });
    }

    const updatedRoomData = { ...roomData, participants: updatedParticipants };
    setRoomData(updatedRoomData);

    // 로컬스토리지에 방 데이터 저장 & 내가 쓴 이름 기록 남기기!
    localStorage.setItem(
      updatedRoomData.roomCode,
      JSON.stringify(updatedRoomData),
    );
    localStorage.setItem(`my_name_in_${updatedRoomData.roomCode}`, name);

    setEditingName(null); // 수정 모드 초기화
    setCurrentStep("RESULT");
  };

  // 2. 본인 확인 후 삭제 처리 함수
  const handleScheduleDelete = (nameToDelete: string) => {
    const updatedParticipants = roomData.participants.filter(
      (p) => p.name !== nameToDelete,
    );
    const updatedRoomData = { ...roomData, participants: updatedParticipants };

    setRoomData(updatedRoomData);
    localStorage.setItem(
      updatedRoomData.roomCode,
      JSON.stringify(updatedRoomData),
    );

    // 내 기록 명찰도 사물함에서 지우기
    localStorage.removeItem(`my_name_in_${roomData.roomCode}`);
    setEditingName(null);
    setCurrentStep("INPUT"); // 삭제하면 다시 입력창으로 보냄
  };

  // 3. 수정 버튼 클릭 시 수정 모드로 전환하는 함수
  const handleEditStart = (nameToEdit: string) => {
    setEditingName(nameToEdit);
    setCurrentStep("INPUT"); // 입력 화면으로 이동시키기
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 font-sans">
      <main className="container mx-auto">
        {currentStep === "INPUT" ? (
          <ScheduleInput
            roomData={roomData}
            onSubmitSchedule={handleScheduleSubmit}
            editingName={editingName} // 수정 중인 이름 내려주기
            mySavedName={getMySavedName()} // 사물함에 기록된 내 이름 내려주기
          />
        ) : (
          <ResultView
            roomData={roomData}
            mySavedName={getMySavedName()} // 내 이름 정보를 줘서 내 칩에만 버튼이 뜨게 함
            onEditParticipant={handleEditStart}
            onDeleteParticipant={handleScheduleDelete}
          />
        )}
      </main>
    </div>
  );
}

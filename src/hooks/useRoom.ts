// src/hooks/useRoom.ts
import { useState } from "react";
import type { RoomData } from "../types";

const INITIAL_ROOM_CODE = "1234";

const getInitialData = (): RoomData => {
  const saved = localStorage.getItem(INITIAL_ROOM_CODE);
  if (saved) return JSON.parse(saved);

  return {
    roomCode: INITIAL_ROOM_CODE,
    title: "종강 기념 동기 정기 모임",
    creatorName: "김민준",
    dateRange: { start: "2026-06-20", end: "2026-06-30" },
    participants: [], // 가짜 데이터 깔끔하게 비워둠
    bucketList: [],
  };
};

export function useRoom() {
  const [roomData, setRoomData] = useState<RoomData>(getInitialData);
  const [editingName, setEditingName] = useState<string | null>(null);

  const getMySavedName = () => {
    return localStorage.getItem(`my_name_in_${roomData.roomCode}`);
  };

  // 일정 제출 및 수정
  const handleScheduleSubmit = (name: string, selectedDates: string[]) => {
    let updatedParticipants = [...roomData.participants];

    if (editingName) {
      updatedParticipants = updatedParticipants.map((p) =>
        p.name === editingName ? { name, availableDates: selectedDates } : p,
      );
    } else {
      if (updatedParticipants.some((p) => p.name === name)) {
        alert("이미 존재하는 이름입니다. 수정을 이용해 주세요.");
        return;
      }
      updatedParticipants.push({ name, availableDates: selectedDates });
    }

    const updatedRoomData = { ...roomData, participants: updatedParticipants };
    setRoomData(updatedRoomData);

    localStorage.setItem(
      updatedRoomData.roomCode,
      JSON.stringify(updatedRoomData),
    );
    localStorage.setItem(`my_name_in_${updatedRoomData.roomCode}`, name);
    setEditingName(null);
  };

  // 일정 삭제
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
    localStorage.removeItem(`my_name_in_${roomData.roomCode}`);
    setEditingName(null);
  };

  // 수정 모드 시작
  const handleEditStart = (nameToEdit: string) => {
    setEditingName(nameToEdit);
  };

  // 외부(App.tsx)에서 조립할 때 필요한 재료들만 쏙 내보내기
  return {
    roomData,
    editingName,
    mySavedName: getMySavedName(),
    submitSchedule: handleScheduleSubmit,
    deleteParticipant: handleScheduleDelete,
    startEdit: handleEditStart,
  };
}

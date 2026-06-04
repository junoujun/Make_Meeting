// src/hooks/useRoom.ts
import { useState } from "react";
import type { RoomData, BucketItem } from "../types";

export function useRoom(roomCode: string | null) {
  // 💡 [해결 핵심] roomCode를 기록해두기 위한 임시 렌더링 상태 관리
  const [prevRoomCode, setPrevRoomCode] = useState<string | null>(roomCode);

  const [roomData, setRoomData] = useState<RoomData | null>(() => {
    if (!roomCode) return null;
    const saved = localStorage.getItem(roomCode);
    return saved ? JSON.parse(saved) : null;
  });

  const [mySavedName, setMySavedName] = useState<string | null>(() => {
    if (!roomCode) return null;
    return localStorage.getItem(`my_name_in_${roomCode}`);
  });

  const [editingName, setEditingName] = useState<string | null>(null);

  // 💡 [에러 없이 실시간 동기화하기]
  // 렌더링 도중 roomCode가 바뀐 것을 감지하면, useEffect를 쓰지 않고 리액트 공식 문서의 정석 가이드대로 
  // 렌더링 흐름 속에서 이전 코드와 비교해 상태를 즉시 동기화해 줍니다. 
  // 이렇게 하면 Cascading Renders 에러도 안 나고 화면도 하얗게 멈추지 않습니다!
  if (roomCode !== prevRoomCode) {
    setPrevRoomCode(roomCode);
    if (!roomCode) {
      setRoomData(null);
      setMySavedName(null);
    } else {
      const saved = localStorage.getItem(roomCode);
      setRoomData(saved ? JSON.parse(saved) : null);
      setMySavedName(localStorage.getItem(`my_name_in_${roomCode}`));
    }
    setEditingName(null);
  }

  // 로컬스토리지 저장 헬퍼
  const saveRoomData = (newData: RoomData) => {
    setRoomData(newData);
    localStorage.setItem(newData.roomCode, JSON.stringify(newData));
  };

  // 일정 제출 및 수정
  const handleScheduleSubmit = (name: string, selectedDates: string[]) => {
    if (!roomData) return;
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

    const updated = { ...roomData, participants: updatedParticipants };
    saveRoomData(updated);
    localStorage.setItem(`my_name_in_${roomData.roomCode}`, name);
    setMySavedName(name);
    setEditingName(null);
  };

  // 일정 삭제
  const handleScheduleDelete = (nameToDelete: string) => {
    if (!roomData) return;
    const updatedParticipants = roomData.participants.filter((p) => p.name !== nameToDelete);
    const updated = { ...roomData, participants: updatedParticipants };
    
    saveRoomData(updated);
    localStorage.removeItem(`my_name_in_${roomData.roomCode}`);
    setMySavedName(null);
    setEditingName(null);
  };

  // 버킷리스트 아이템 추가
  const handleAddBucketItem = (content: string, selectedDate: string) => {
    if (!roomData) return;
    const newItem: BucketItem = {
      id: crypto.randomUUID(),
      content,
      selectedDate,
      votes: 0,
      isVoted: false,
    };
    const updated = { ...roomData, bucketList: [newItem, ...roomData.bucketList] };
    saveRoomData(updated);
  };

  // 버킷리스트 투표 토글
  const handleToggleVote = (id: string) => {
    if (!roomData) return;
    const updatedList = roomData.bucketList.map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        votes: item.isVoted ? item.votes - 1 : item.votes + 1,
        isVoted: !item.isVoted,
      };
    });
    const updated = { ...roomData, bucketList: updatedList };
    saveRoomData(updated);
  };

  // 버킷리스트 삭제
  const handleDeleteBucketItem = (id: string) => {
    if (!roomData) return;
    const updatedList = roomData.bucketList.filter((item) => item.id !== id);
    const updated = { ...roomData, bucketList: updatedList };
    saveRoomData(updated);
  };

  return {
    roomData,
    editingName,
    mySavedName,
    submitSchedule: handleScheduleSubmit,
    deleteParticipant: handleScheduleDelete,
    startEdit: (name: string) => setEditingName(name),
    addBucketItem: handleAddBucketItem,
    toggleVote: handleToggleVote,
    deleteBucketItem: handleDeleteBucketItem,
  };
}
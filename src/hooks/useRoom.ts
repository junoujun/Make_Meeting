import { useEffect, useState } from "react";
import type { RoomData, BucketItem } from "../types";
import { saveRoom, subscribeRoom } from "../services/Roomservice";

export function useRoom(roomCode: string | null) {
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [mySavedName, setMySavedName] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string | null>(null);

  useEffect(() => {
    if (!roomCode) return;

    const unsubscribe = subscribeRoom(roomCode, (data) => {
      setRoomData(data);
      setMySavedName(localStorage.getItem(`my_name_in_${roomCode}`));
    });

    return () => {
      unsubscribe();
    };
  }, [roomCode]);

  const currentRoomData =
    roomData && roomData.roomCode === roomCode ? roomData : null;

  const currentMySavedName = currentRoomData ? mySavedName : null;

  const saveRoomData = async (newData: RoomData) => {
    setRoomData(newData);
    await saveRoom(newData);
  };

  const handleScheduleSubmit = async (
    name: string,
    selectedDates: string[],
  ) => {
    if (!currentRoomData) return;

    let updatedParticipants = [...currentRoomData.participants];

    if (editingName) {
      updatedParticipants = updatedParticipants.map((p) =>
        p.name === editingName ? { name, availableDates: selectedDates } : p,
      );
    } else {
      if (updatedParticipants.some((p) => p.name === name)) {
        alert("이미 존재하는 이름입니다. 수정을 이용해 주세요.");
        return;
      }

      updatedParticipants.push({
        name,
        availableDates: selectedDates,
      });
    }

    const updated: RoomData = {
      ...currentRoomData,
      participants: updatedParticipants,
    };

    await saveRoomData(updated);

    localStorage.setItem(`my_name_in_${currentRoomData.roomCode}`, name);
    setMySavedName(name);
    setEditingName(null);
  };

  const handleScheduleDelete = async (nameToDelete: string) => {
    if (!currentRoomData) return;

    const updatedParticipants = currentRoomData.participants.filter(
      (p) => p.name !== nameToDelete,
    );

    const updated: RoomData = {
      ...currentRoomData,
      participants: updatedParticipants,
    };

    await saveRoomData(updated);

    localStorage.removeItem(`my_name_in_${currentRoomData.roomCode}`);
    setMySavedName(null);
    setEditingName(null);
  };

  const handleAddBucketItem = async (content: string, selectedDate: string) => {
    if (!currentRoomData) return;

    const newItem: BucketItem = {
      id: crypto.randomUUID(),
      content,
      selectedDate,
      votes: 0,
      isVoted: false,
    };

    const updated: RoomData = {
      ...currentRoomData,
      bucketList: [newItem, ...currentRoomData.bucketList],
    };

    await saveRoomData(updated);
  };

  const handleToggleVote = async (id: string) => {
    if (!currentRoomData) return;

    const updatedList = currentRoomData.bucketList.map((item) => {
      if (item.id !== id) return item;

      return {
        ...item,
        votes: item.isVoted ? item.votes - 1 : item.votes + 1,
        isVoted: !item.isVoted,
      };
    });

    const updated: RoomData = {
      ...currentRoomData,
      bucketList: updatedList,
    };

    await saveRoomData(updated);
  };

  const handleDeleteBucketItem = async (id: string) => {
    if (!currentRoomData) return;

    const updatedList = currentRoomData.bucketList.filter(
      (item) => item.id !== id,
    );

    const updated: RoomData = {
      ...currentRoomData,
      bucketList: updatedList,
    };

    await saveRoomData(updated);
  };

  return {
    roomData: currentRoomData,
    editingName,
    mySavedName: currentMySavedName,
    submitSchedule: handleScheduleSubmit,
    deleteParticipant: handleScheduleDelete,
    startEdit: (name: string) => setEditingName(name),
    addBucketItem: handleAddBucketItem,
    toggleVote: handleToggleVote,
    deleteBucketItem: handleDeleteBucketItem,
  };
}

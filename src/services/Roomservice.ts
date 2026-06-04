import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase";
import type { RoomData } from "../types";

const COLLECTION_NAME = "rooms";

export const createRoom = async (roomData: RoomData) => {
  await setDoc(doc(db, COLLECTION_NAME, roomData.roomCode), roomData);
};

export const getRoom = async (roomCode: string): Promise<RoomData | null> => {
  const roomRef = doc(db, COLLECTION_NAME, roomCode);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) {
    return null;
  }

  return roomSnap.data() as RoomData;
};

export const saveRoom = async (roomData: RoomData) => {
  await setDoc(doc(db, COLLECTION_NAME, roomData.roomCode), roomData);
};

export const subscribeRoom = (
  roomCode: string,
  callback: (roomData: RoomData | null) => void,
): Unsubscribe => {
  const roomRef = doc(db, COLLECTION_NAME, roomCode);

  return onSnapshot(roomRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }

    callback(snapshot.data() as RoomData);
  });
};

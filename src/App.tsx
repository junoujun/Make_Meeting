import { useState } from "react";
import Home from "./components/memberA/Home";
import Join from "./components/memberA/Join";
import Make from "./components/memberA/Make";
import Meeting_Details from "./components/memberA/Meeting_Details";
import { useRoom } from "./hooks/useRoom";
import { getRoom } from "./services/Roomservice";

export type PageState = "Home" | "Join" | "Make" | "Meeting_Details";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageState>("Home");

  // 사용자가 선택하거나 생성한 방 코드 추적 관리
  const [activeRoomCode, setActiveRoomCode] = useState<string | null>(null);

  //커스텀 훅에 현재 활성화된 방 코드 주입
  const {
    roomData,
    editingName,
    mySavedName,
    submitSchedule,
    deleteParticipant,
    startEdit,
    addBucketItem,
    toggleVote,
    deleteBucketItem,
  } = useRoom(activeRoomCode);

  // 방 입장 핸들러
  const handleJoinRoom = async (code: string) => {
    const room = await getRoom(code);
    if (!room) {
      alert("존재하지 않는 약속 방 코드입니다!");
      return;
    }
    setActiveRoomCode(code); //DB 연동으로 변경된 부분
    setCurrentPage("Meeting_Details");
  };

  // 방 생성 핸들러
  const handleRoomCreated = (code: string) => {
    setActiveRoomCode(code);
    setCurrentPage("Meeting_Details");
  };

  return (
    <>
      {/*<button onClick={testFirebaseConnection}> firebase test</button>*/}

      {currentPage === "Home" && <Home setCurrentPage={setCurrentPage} />}

      {currentPage === "Join" && (
        <Join setCurrentPage={setCurrentPage} onJoinRoom={handleJoinRoom} />
      )}

      {currentPage === "Make" && (
        <Make
          setCurrentPage={setCurrentPage}
          onRoomCreated={handleRoomCreated}
        />
      )}

      {currentPage === "Meeting_Details" && roomData && (
        <Meeting_Details
          setCurrentPage={setCurrentPage}
          roomData={roomData}
          mySavedName={mySavedName}
          editingName={editingName}
          submitSchedule={submitSchedule}
          deleteParticipant={deleteParticipant}
          startEdit={startEdit}
          addBucketItem={addBucketItem}
          toggleVote={toggleVote}
          deleteBucketItem={deleteBucketItem}
        />
      )}
    </>
  );
}

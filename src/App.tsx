import React, { useState } from "react";
import Home from "./components/memberA/Home";
import Join from "./components/memberA/Join";
import Make from "./components/memberA/Make";
import Meeting_Details from "./components/memberA/Meeting_Details";
import { useRoom } from "./hooks/useRoom";
import { getRoom } from "./services/Roomservice";

export type PageState = "Home" | "Join" | "Make" | "Meeting_Details";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageState>("Home");

  // 💡 사용자가 선택하거나 생성한 방 코드를 추적 관리합니다.
  const [activeRoomCode, setActiveRoomCode] = useState<string | null>(null);

  // 💡 커스텀 훅에 현재 활성화된 방 코드를 주입하여 데이터를 유기적으로 끌어옵니다.
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

  // [방 입장 핸들러] 자식 컴포넌트로부터 코드를 받아 연동
  const handleJoinRoom = async (code: string) => {
    const room = await getRoom(code);
    if (!room) {
      alert("존재하지 않는 약속 방 코드입니다!");
      return;
    }
    setActiveRoomCode(code); //DB 연동으로 변경된 부분
    setCurrentPage("Meeting_Details");
  };

  // [방 생성 핸들러] 방이 새로 만들어졌을 때 코드를 넘겨받아 즉시 대시보드로 이동
  const handleRoomCreated = (code: string) => {
    setActiveRoomCode(code);
    setCurrentPage("Meeting_Details");
  };

  return (
    <>
      {/*<button onClick={testFirebaseConnection}> firebase test</button>*/}

      {currentPage === "Home" && <Home setCurrentPage={setCurrentPage} />}

      {currentPage === "Join" && (
        <Join
          setCurrentPage={setCurrentPage}
          onJoinRoom={handleJoinRoom} // 팀원분 Join 컴포넌트에 이 이벤트 핸들러만 연결해 주면 끝!
        />
      )}

      {currentPage === "Make" && (
        <Make
          setCurrentPage={setCurrentPage}
          onRoomCreated={handleRoomCreated} // 방 생성 시 코드를 받아오도록 연동
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

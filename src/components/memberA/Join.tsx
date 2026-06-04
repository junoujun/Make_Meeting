// src/components/memberA/Join.tsx (또는 올바른 경로)
import React, { useState } from "react"; // 💡 useState 사용을 위해 임포트 확인
import type { PageState } from "../../App";

// 💡 Props 타입 정의에 onJoinRoom 함수를 추가합니다!
type JoinProps = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageState>>;
  onJoinRoom: (code: string) => void; 
};

export default function Join({ setCurrentPage, onJoinRoom }: JoinProps) {
  // 💡 팀원분이 비워둔 input 값을 제어하기 위해 상태를 하나 만듭니다.
  const [roomCode, setRoomCode] = useState("");

  const handleJoinClick = () => {
    if (!roomCode.trim()) {
      alert("방 코드를 입력해주세요!");
      return;
    }
    // 부모(App.tsx)가 내려준 방 입장 핸들러 실행
    onJoinRoom(roomCode.trim().toUpperCase()); 
  };

  return (
    <>
      <button onClick={() => setCurrentPage("Home")}>
        <h1>놀래말래?</h1>
      </button>
      <h1>방 입장하기</h1>
      {/* 💡 value와 onChange를 연결해 유저가 입력한 코드를 붙잡습니다. */}
      <input 
        type="text" 
        value={roomCode} 
        onChange={(e) => setRoomCode(e.target.value)}
        placeholder="4자리 코드 입력"
      />
      <button onClick={handleJoinClick}>입장하기</button>
    </>
  );
}
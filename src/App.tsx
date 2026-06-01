// src/App.tsx
import React, { useState } from "react";
import Home from "./components/memberA/Home"; // 💡 팀원 A의 홈 화면 추가!
import ResultView from "./components/memberB/ResultView";
import ScheduleInput from "./components/memberB/ScheduleInput";
import { useRoom } from "./hooks/useRoom";

export default function App() {
  // 1. 화면 단계 상태에 'HOME'을 새로 추가했습니다! (기본값을 'HOME'으로 설정)
  const [currentStep, setCurrentStep] = useState<"HOME" | "INPUT" | "RESULT">("HOME");

  const {
    roomData,
    editingName,
    mySavedName,
    submitSchedule,
    deleteParticipant,
    startEdit,
  } = useRoom();

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 font-sans">
      
      {/* 🛠️ 확장된 상단 임시 스위치 탭 (팀원 A의 Home까지 편하게 테스트 가능!) */}
      <div className="max-w-md mx-auto mb-8 flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
        <button
          onClick={() => setCurrentStep("HOME")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
            currentStep === "HOME"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          🏠 홈 화면 (멤버A)
        </button>
        <button
          onClick={() => setCurrentStep("INPUT")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
            currentStep === "INPUT"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          📝 일정 입력 (멤버B)
        </button>
        <button
          onClick={() => setCurrentStep("RESULT")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
            currentStep === "RESULT"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          📊 결과 확인 (멤버B)
        </button>
      </div>

      {/* 🧩 메인 화면 조건부 조립 영역 */}
      <main className="container mx-auto">
        {currentStep === "HOME" && (
          <Home />
        )}

        {currentStep === "INPUT" && (
          <ScheduleInput
            roomData={roomData}
            onSubmitSchedule={(name, dates) => {
              submitSchedule(name, dates);
              setCurrentStep("RESULT");
            }}
            editingName={editingName}
            mySavedName={mySavedName}
          />
        )}

        {currentStep === "RESULT" && (
          <ResultView
            roomData={roomData}
            mySavedName={mySavedName}
            onEditParticipant={(name) => {
              startEdit(name);
              setCurrentStep("INPUT");
            }}
            onDeleteParticipant={(name) => {
              deleteParticipant(name);
              setCurrentStep("INPUT");
            }}
          />
        )}
      </main>
    </div>
  );
}
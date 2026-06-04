// src/App.tsx
import React, { useState } from "react";
import ResultView from "./components/memberB/ResultView";
import ScheduleInput from "./components/memberB/ScheduleInput";
import { useRoom } from "./hooks/useRoom"; // 💡 로직 파일 불러오기

export default function App() {
  const [currentStep, setCurrentStep] = useState<"INPUT" | "RESULT">("INPUT");

  // 💡 버튼 기능과 데이터들을 훅에서 한 번에 슥 꺼내옵니다.
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
      {/* 🛠️ 임시 스위치 탭 (나중에 팀원 A가 하단 탭바로 교체하기 최고로 쉬운 영역) */}
      <div className="max-w-md mx-auto mb-8 flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
        <button
          onClick={() => setCurrentStep("INPUT")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
            currentStep === "INPUT"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          📝 내 일정 입력 탭
        </button>
        <button
          onClick={() => setCurrentStep("RESULT")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
            currentStep === "RESULT"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          📊 종합 결과 확인 탭
        </button>
      </div>

      {/* 🧩 메인 화면 조립 영역 */}
      <main className="container mx-auto">
        {currentStep === "INPUT" ? (
          <ScheduleInput
            roomData={roomData}
            onSubmitSchedule={(name, dates) => {
              submitSchedule(name, dates);
              setCurrentStep("RESULT"); // 제출 후 결과창 이동 액션만 App에서 제어
            }}
            editingName={editingName}
            mySavedName={mySavedName}
          />
        ) : (
          <ResultView
            roomData={roomData}
            mySavedName={mySavedName}
            onEditParticipant={(name) => {
              startEdit(name);
              setCurrentStep("INPUT"); // 수정 누르면 입력창 이동 액션만 App에서 제어
            }}
            onDeleteParticipant={(name) => {
              deleteParticipant(name);
              setCurrentStep("INPUT"); // 삭제 후 입력창 이동 액션만 App에서 제어
            }}
          />
        )}
      </main>
    </div>
  );
}
// =======
// import { useState } from "react";
// import Home from "./components/memberA/Home";
// import Join from "./components/memberA/Join";
// import Make from "./components/memberA/Make";
// import Meeting_Details from "./components/memberA/Meeting_Details";

// export type PageState =
//   | "Home"
//   | "Join"
//   | "Make"
//   | "Bucket_List"
//   | "Meeting_Details";

// export default function App() {
//   const [currentPage, setCurrentPage] = useState<PageState>("Home");

//   return (
//     <>
//       {currentPage === "Home" && <Home setCurrentPage={setCurrentPage} />}
//       {currentPage === "Join" && <Join setCurrentPage={setCurrentPage} />}
//       {currentPage === "Make" && <Make setCurrentPage={setCurrentPage} />}
//       {currentPage === "Meeting_Details" && (
//         <Meeting_Details setCurrentPage={setCurrentPage} />
//       )}
//     </>
// >>>>>>> JuneWoo
//   );
// }

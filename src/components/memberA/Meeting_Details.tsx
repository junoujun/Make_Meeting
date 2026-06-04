import React, { useState } from "react";
import type { PageState } from "../../App";
import type { RoomData } from "../../types";
import ScheduleInput from "../memberB/ScheduleInput";
import ResultView from "../memberB/ResultView";

interface Props {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageState>>;
  roomData: RoomData;
  mySavedName: string | null;
  editingName: string | null;
  submitSchedule: (name: string, dates: string[]) => void;
  deleteParticipant: (name: string) => void;
  startEdit: (name: string) => void;
  addBucketItem: (content: string, date: string) => void;
  toggleVote: (id: string) => void;
  deleteBucketItem: (id: string) => void;
}

export default function Meeting_Details({
  setCurrentPage,
  roomData,
  mySavedName,
  editingName,
  submitSchedule,
  deleteParticipant,
  startEdit,
  addBucketItem,
  toggleVote,
  deleteBucketItem,
}: Props) {
  // 일정 폼 스위치 관리 (기본값은 로그인 여부에 따라)
  const [calendarView, setCalendarView] = useState<"INPUT" | "RESULT">(
    mySavedName ? "RESULT" : "INPUT"
  );

  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleAddClick = () => {
    if (!content.trim() || !selectedDate) {
      alert("하고싶은 일과 날짜를 모두 선택해주세요!");
      return;
    }
    addBucketItem(content.trim(), selectedDate);
    setContent("");
    setSelectedDate("");
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8 font-sans">
      {/* 상단 네비게이션 헤더 */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <button onClick={() => setCurrentPage("Home")} className="text-2xl font-black text-slate-800 hover:opacity-80">
          🎈 놀래말래?
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setCalendarView("INPUT")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${calendarView === "INPUT" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"}`}
          >
            ✏️ 내 일정 입력
          </button>
          <button
            onClick={() => setCalendarView("RESULT")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${calendarView === "RESULT" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"}`}
          >
            📊 결과 대시보드
          </button>
        </div>
      </div>

      {/* 🧩 1. 달력 파트 조립 (상태에 따라 스위칭) */}
      <section>
        {calendarView === "INPUT" ? (
          <ScheduleInput
            roomData={roomData}
            onSubmitSchedule={(name, dates) => {
              submitSchedule(name, dates);
              setCalendarView("RESULT");
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
              setCalendarView("INPUT");
            }}
            onDeleteParticipant={deleteParticipant}
          />
        )}
      </section>

      <hr className="border-slate-200" />

      {/* 🧩 2. 팀원분이 만든 버킷리스트 파트 조립 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* 입력 세션 */}
        <section className="md:col-span-1 bg-amber-50/60 p-5 rounded-2xl border border-amber-200/50 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-800 text-base flex items-center gap-1">✨ 우리 만나서 뭐하지?</h2>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="하고 싶은 일을 입력하세요 (예: 한강 치맥)"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 bg-white"
            />
            <input
              type="date"
              value={selectedDate}
              min={roomData.dateRange.start}
              max={roomData.dateRange.end}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 bg-white"
            />
            <button onClick={handleAddClick} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-xl text-xs shadow-sm transition-colors">
              추가하기
            </button>
          </div>
        </section>

        {/* 리스트 출력 세션 */}
        <section className="md:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
          <h2 className="font-bold text-slate-800 text-base mb-4">📜 제안된 버킷리스트</h2>
          {roomData.bucketList.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">아직 추가된 아이디어가 없습니다. 먼저 제안해보세요!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roomData.bucketList.map((item) => (
                <div key={item.id} className={`p-4 rounded-xl border flex flex-col justify-between gap-3 shadow-sm transition-all ${item.isVoted ? 'bg-blue-50/40 border-blue-200' : 'bg-slate-50/50 border-slate-100'}`}>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">🔥 {item.content}</p>
                    <p className="text-[11px] text-slate-400 mt-1">📅 제안 날짜: {item.selectedDate}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-1">
                    <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-100">👍 {item.votes}표</span>
                    <div className="flex gap-1.5">
                      <button onClick={() => toggleVote(item.id)} className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${item.isVoted ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400'}`}>
                        {item.isVoted ? "취소" : "투표"}
                      </button>
                      <button onClick={() => deleteBucketItem(item.id)} className="text-xs px-2.5 py-1 bg-white text-red-500 rounded-lg border border-slate-100 hover:bg-red-50 transition-all">
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
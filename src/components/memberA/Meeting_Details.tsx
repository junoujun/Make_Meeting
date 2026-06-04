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

// 💡 3개의 큰 메인 창을 정의하는 타입
type DetailTabState = "INPUT" | "RESULT" | "BUCKET";

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
  // 💡 기본 화면을 내 이름 저장 여부에 따라 스마트하게 지정
  const [activeTab, setActiveTab] = useState<DetailTabState>(
    mySavedName ? "RESULT" : "INPUT",
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
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 font-sans">
      {/* ─── 상단 글로벌 헤더 (서비스 로고 & 룸 코드) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <button
            onClick={() => setCurrentPage("Home")}
            className="text-2xl font-black text-slate-900 hover:opacity-70 transition-opacity flex items-center gap-2"
          >
            🎈 <span className="tracking-tight">놀래말래?</span>
          </button>
          <p className="text-sm text-slate-500 font-bold mt-1">
            📌 {roomData.title}
          </p>
        </div>
      </div>

      {/* ─── 🌟 대형 3단 탭 네비게이션 바 (크게 크게 움직이는 영역) ─── */}
      <div className="grid grid-cols-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 shadow-inner">
        <button
          onClick={() => setActiveTab("INPUT")}
          className={`py-3.5 text-xs sm:text-sm font-black rounded-xl transition-all ${
            activeTab === "INPUT"
              ? "bg-white text-slate-950 shadow-md transform scale-[1.01]"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          ✏️ 내 일정 입력
        </button>
        <button
          onClick={() => setActiveTab("RESULT")}
          className={`py-3.5 text-xs sm:text-sm font-black rounded-xl transition-all ${
            activeTab === "RESULT"
              ? "bg-white text-slate-950 shadow-md transform scale-[1.01]"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          📊 결과 대시보드
        </button>
        <button
          onClick={() => setActiveTab("BUCKET")}
          className={`py-3.5 text-xs sm:text-sm font-black rounded-xl transition-all ${
            activeTab === "BUCKET"
              ? "bg-white text-slate-950 shadow-md transform scale-[1.01]"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          ✨ 만나서 뭐하지?
        </button>
      </div>

      {/* ─── 🧩 메인 대형 창 렌더링 스페이스 ─── */}
      <main className="min-h-[50vh] transition-all duration-300">
        {/* 1번 창: 내 일정 입력 */}
        {activeTab === "INPUT" && (
          <div className="animate-fade-in">
            <ScheduleInput
              roomData={roomData}
              onSubmitSchedule={(name, dates) => {
                submitSchedule(name, dates);
                setActiveTab("RESULT"); // 일정 제출하면 결과 대시보드 창으로 크게 슥 이동
              }}
              editingName={editingName}
              mySavedName={mySavedName}
            />
          </div>
        )}

        {/* 2번 창: 종합 결과 확인 (내 달력 및 순위 보드 포함) */}
        {activeTab === "RESULT" && (
          <div className="animate-fade-in">
            <ResultView
              roomData={roomData}
              mySavedName={mySavedName}
              onEditParticipant={(name) => {
                startEdit(name);
                setActiveTab("INPUT"); // 수정 누르면 다시 입력 창으로 슥 이동
              }}
              onDeleteParticipant={deleteParticipant}
            />
          </div>
        )}

        {/* 3번 창: ✨ 완전히 독자적인 창으로 격리된 버킷리스트 세션 */}
        {activeTab === "BUCKET" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start animate-fade-in">
            {/* 왼쪽: 버킷리스트 작성 카드 */}
            <div className="md:col-span-1 bg-amber-50/70 p-6 rounded-3xl border border-amber-200/60 shadow-md space-y-4">
              <div className="space-y-1">
                <h2 className="font-black text-slate-900 text-base flex items-center gap-1">
                  💡 위시 리스트 추가
                </h2>
                <p className="text-[11px] text-amber-800/80 font-medium">
                  우리 만나면 꼭 하고 싶은 것을 제안해 보세요.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="하고 싶은 일을 입력 (예: 보드게임방 가기)"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 bg-white"
                />
                <input
                  type="date"
                  value={selectedDate}
                  min={roomData.dateRange.start}
                  max={roomData.dateRange.end}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 bg-white font-medium text-slate-700"
                />
                <button
                  onClick={handleAddClick}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-3 rounded-xl text-xs shadow-sm transition-all"
                >
                  리스트에 아이디어 추가
                </button>
              </div>
            </div>

            {/* 오른쪽: 버킷리스트 목록 카드 대형 스페이스 */}
            <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-md">
              <h2 className="font-black text-slate-900 text-base mb-4 flex items-center gap-1.5">
                📜 친구들의 아이디어 명단
              </h2>
              {roomData.bucketList.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <p className="text-2xl">💤</p>
                  <p className="text-xs text-slate-400 font-medium">
                    아직 제안된 아이디어가 없어요. 첫 번째 주인공이 되어보세요!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {roomData.bucketList.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border flex flex-col justify-between gap-4 shadow-sm transition-all ${
                        item.isVoted
                          ? "bg-blue-50/40 border-blue-200 ring-1 ring-blue-100"
                          : "bg-slate-50/50 border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div>
                        <p className="font-black text-slate-900 text-sm">
                          🎯 {item.content}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium mt-1">
                          📅 희망일자: {item.selectedDate}
                        </p>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-200/40 pt-3">
                        <span className="text-xs font-black text-blue-950 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                          👍 {item.votes} 명 찬성
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleVote(item.id)}
                            className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                              item.isVoted
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-white text-slate-600 border border-slate-200 hover:border-blue-400"
                            }`}
                          >
                            {item.isVoted ? "취소" : "투표"}
                          </button>
                          <button
                            onClick={() => deleteBucketItem(item.id)}
                            className="text-xs px-3 py-1.5 bg-white text-red-500 font-bold rounded-xl border border-slate-100 hover:bg-red-50 transition-all"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

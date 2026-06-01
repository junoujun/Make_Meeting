import React from 'react';
import { type Participant } from '../../types';

interface Props {
  participants: Participant[];
  mySavedName: string | null;
  onEditParticipant: (name: string) => void;
  onDeleteParticipant: (name: string) => void;
}

export default function ParticipantList({ participants, mySavedName, onEditParticipant, onDeleteParticipant }: Props) {
  return (
    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/60 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-3 text-base">👤 투표 완료 인원 ({participants.length}명)</h3>
      <div className="flex flex-wrap gap-2">
        {participants.map((p) => {
          // 현재 그려지는 이름 칩이 "내 브라우저에 저장된 나 자신"인지 확인
          const isMe = p.name === mySavedName;

          return (
            <div key={p.name} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border shadow-sm transition-all ${
              isMe ? 'bg-blue-50 border-blue-300 text-blue-950 font-bold' : 'bg-white border-slate-200 text-slate-600'
            }`}>
              <span>{p.name} {isMe && '(나)'}</span>
              
              {/* 내가 작성한 칩일 때만 수정/삭제 관리 버튼 노출! */}
              {isMe && (
                <div className="flex items-center gap-1 ml-1 border-l border-blue-200 pl-1.5">
                  <button 
                    onClick={() => onEditParticipant(p.name)}
                    className="text-slate-400 hover:text-blue-600 font-bold"
                    title="수정"
                  >
                    ✎
                  </button>
                  <button 
                    onClick={() => {
                      if(confirm('내 일정을 정말 삭제하시겠습니까?')) onDeleteParticipant(p.name);
                    }}
                    className="text-slate-400 hover:text-red-500 font-bold"
                    title="삭제"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
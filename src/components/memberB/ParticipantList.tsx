import React from 'react';
import { type Participant } from '../../types';

interface Props {
  participants: Participant[];
}

export default function ParticipantList({ participants }: Props) {
  const totalCount = participants.length;

  return (
    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/60 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-base">
        <span>👤</span> 투표 완료 인원 ({totalCount}명)
      </h3>

      {totalCount === 0 ? (
        <p className="text-xs text-gray-400 py-2">아직 참여한 친구가 없습니다.</p>
      ) : (
        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
          {participants.map((p) => (
            <span 
              key={p.name} 
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600 shadow-sm hover:border-slate-300 transition-colors"
            >
              [{p.name}]
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { type Participant } from '../../types';
import { getTopDates } from '../../utils/dateMemo';

interface Props {
  participants: Participant[];
}

export default function RankingBoard({ participants }: Props) {
  // dateMemo.ts에서 만든 정렬 함수로 상위 3개 날짜만 추출
  const topDates = getTopDates(participants).slice(0, 3);

  // '2026-05-23' 문자열을 '5월 23일' 형태로 예쁘게 바꿔주는 헬퍼 함수
  const formatDate = (dateStr: string) => {
    const [,, day] = dateStr.split('-');
    // 5월 달력 기준이므로 가독성을 위해 월/일을 매칭 (필요시 월도 추출 가능)
    return `5월 ${parseInt(day)}일`;
  };

  return (
    <div className="bg-amber-50/70 p-5 rounded-xl border border-amber-200/60 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-base">
        <span>🏆</span> 가장 많이 모일 수 있는 날 랭킹
      </h3>
      
      {topDates.length === 0 ? (
        <p className="text-xs text-gray-400 py-2">아직 투표된 날짜가 없습니다.</p>
      ) : (
        <ul className="space-y-2.5">
          {topDates.map((rank, index) => {
            const isTop = index === 0;
            return (
              <li 
                key={rank.date} 
                className={`text-sm flex items-center justify-between p-2 rounded-lg ${
                  isTop ? 'bg-amber-100/50 font-semibold text-amber-950' : 'text-slate-700'
                }`}
              >
                <div>
                  <span className={`inline-block w-6 text-center ${isTop ? 'text-amber-600 font-extrabold' : 'text-slate-400'}`}>
                    {index + 1}위
                  </span>
                  <span>{formatDate(rank.date)}</span>
                </div>
                <span className="text-xs text-slate-500 bg-white/80 px-2 py-0.5 rounded-full border border-slate-100">
                  {rank.count}명 가능
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
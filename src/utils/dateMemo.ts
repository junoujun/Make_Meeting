
// src/utils/dateMemo.ts
import type { Participant } from "../types";

export interface DateRank {
  date: string;
  count: number;
}

// 날짜별로 몇 명이 선택했는지 집계하는 함수 (히트맵용)
export const calculateDateCounts = (
  participants: Participant[],
): Record<string, number> => {
  const counts: Record<string, number> = {};

  participants.forEach((p) => {
    p.availableDates.forEach((date) => {
      counts[date] = (counts[date] || 0) + 1;
    });
  });

  return counts; // 예: { '2026-06-05': 3, '2026-06-06': 1 }
};

// 많이 겹치는 순서대로 정렬하여 랭킹을 매기는 함수 (랭킹 보드용)
export const getTopDates = (participants: Participant[]): DateRank[] => {
  const counts = calculateDateCounts(participants);

  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => b.count - a.count); // 투표수 내림차순 정렬
};

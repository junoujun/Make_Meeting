// src/types/index.ts

// 1. 참여자 개인의 선택 데이터
export interface Participant {
  name: string;
  availableDates: string[]; // ['2026-06-05', '2026-06-06'] 형태의 ISO 문자열 (YYYY-MM-DD)
}

// 2. 버킷리스트 아이템
export interface BucketItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

// 3. 로컬스토리지에 저장될 하나의 '방(Room)' 전체 데이터
export interface RoomData {
  roomCode: string; // 4자리 고유 코드 (예: 'A3F2')
  title: string; // 약속 방 제목
  creatorName: string; // 방장 이름
  dateRange: {
    start: string; // 후보 날짜 범위 시작 (YYYY-MM-DD)
    end: string; // 후보 날짜 범위 끝 (YYYY-MM-DD)
  };
  participants: Participant[]; // 참여자 명단 및 일정
  bucketList: BucketItem[]; // 만나서 뭐하지 리스트
}

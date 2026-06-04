export interface Participant {
  name: string;
  availableDates: string[];
}

// 💡 팀원분의 기획을 반영하여 버킷리스트 아이템 타입 확장
export interface BucketItem {
  id: string;
  content: string; // 하고 싶은 일
  selectedDate: string; // 제안된 날짜
  votes: number; // 투표 수
  isVoted: boolean; // 내가 투표했는지 여부
}

export interface RoomData {
  roomCode: string;
  title: string;
  creatorName: string;
  dateRange: {
    start: string;
    end: string;
  };
  participants: Participant[];
  bucketList: BucketItem[];
}

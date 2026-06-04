import type { PageState } from "../../App";
import { useState } from "react";

type BucketItem = {
  id: string;
  content: string;
  selectedDate: string;
  votes: number;
  isVoted: boolean;
};

type LoginProps = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageState>>;
};

export default function Meeting_Details({ setCurrentPage }: LoginProps) {
  const [bucketList, setBucketList] = useState<BucketItem[]>([]);

  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleAddBucktItem = () => {
    if (!content.trim()) {
      alert("하고싶은 일을 입력하세요");
      return;
    }

    if (!selectedDate) {
      alert("날짜를 선택하세요");
      return;
    }

    const newItem: BucketItem = {
      id: crypto.randomUUID(),
      content,
      selectedDate,
      votes: 0,
      isVoted: false,
    };

    setBucketList((prevList) => [newItem, ...prevList]);

    setContent("");
    setSelectedDate("");
  };

  const handleVote = (id: string) => {
    setBucketList((prevList) =>
      prevList.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          ...item,
          votes: item.isVoted ? item.votes - 1 : item.votes + 1,
          isVoted: !item.isVoted,
        };
      }),
    );
  };

  const handleDelete = (id: string) => {
    setBucketList((prevList) => prevList.filter((item) => item.id !== id));
  };

  return (
    <>
      <button onClick={() => setCurrentPage("Home")}>
        <h1>놀래말래?</h1>
      </button>

      <h1>약속 세부 사항</h1>

      <section>
        <h2>하고 싶은 일 입력</h2>

        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="하고 싶은 일을 입력하세요"
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <button onClick={handleAddBucktItem}>추가</button>
      </section>

      <hr />

      <section>
        <h2>추가된 리스트</h2>

        {bucketList.length === 0 ? (
          <p>아직 추가된 일이 없습니다.</p>
        ) : (
          <ul>
            {" "}
            {bucketList.map((item) => (
              <li key={item.id}>
                <p>하고 싶은 일: {item.content}</p>
                <p>날짜: {item.selectedDate}</p>
                <p>투표 수: {item.votes}</p>

                <button onClick={() => handleVote(item.id)}>
                  {item.isVoted ? "투표 취소" : "투표하기"}
                </button>
                <button onClick={() => handleDelete(item.id)}>삭제</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

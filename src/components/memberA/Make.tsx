import type { PageState } from "../../App";
import DateRangeSelector from "./DateRangeSelector";
import { useState } from "react";

type LoginProps = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageState>>;
};

type DateRange = {
  startDate: string;
  endDate: string;
};

export default function Make({ setCurrentPage }: LoginProps) {
  const [medicineName, setMedicineName] = useState("");
  const [diseaseName, setDiseaseName] = useState("");

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "",
    endDate: "",
  });

  const handleCreateRoom = () => {
    const roomData = {
      medicineName,
      diseaseName,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    };

    console.log(roomData);
  };

  return (
    <>
      <button onClick={() => setCurrentPage("Home")}>
        <h1>놀래말래?</h1>
      </button>
      <section>
        <div>
          <label htmlFor="medicineName">약속 이름: </label>
          <input
            id="medicineName"
            type="text"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            placeholder="진짜 밥먹기"
          />
        </div>

        <div>
          <label htmlFor="diseaseName">방장 이름: </label>
          <input
            id="diseaseName"
            type="text"
            value={diseaseName}
            onChange={(e) => setDiseaseName(e.target.value)}
            placeholder="홍길동"
          />
        </div>
      </section>

      <section>
        <DateRangeSelector
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onChangeDateRange={setDateRange}
        />
      </section>

      <button onClick={handleCreateRoom}>방 만들기</button>
    </>
  );
}

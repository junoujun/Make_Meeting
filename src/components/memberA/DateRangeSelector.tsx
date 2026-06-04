export type DateRange = {
  startDate: string;
  endDate: string;
};

type DateRangeSelectorProps = {
  startDate: string;
  endDate: string;
  onChangeDateRange: (dateRange: DateRange) => void;
};

export default function DateRangeSelector({
  startDate,
  endDate,
  onChangeDateRange,
}: DateRangeSelectorProps) {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeDateRange({
      startDate: e.target.value,
      endDate,
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeDateRange({
      startDate,
      endDate: e.target.value,
    });
  };

  return (
    <div>
      <h2>달력</h2>

      <div>
        <label htmlFor="startDate">시작 날짜</label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
        />
      </div>

      <div>
        <label htmlFor="endDate">종료 날짜</label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
        />
      </div>

      <p>선택한 시작 날짜: {startDate || "없음"}</p>
      <p>선택한 종료 날짜: {endDate || "없음"}</p>
    </div>
  );
}

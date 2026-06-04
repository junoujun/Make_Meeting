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
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1">📅 조율할 후보 날짜 범위 설정</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="startDate" className="text-[11px] font-semibold text-slate-400">시작일</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => onChangeDateRange({ startDate: e.target.value, endDate })}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-medium text-slate-700"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="endDate" className="text-[11px] font-semibold text-slate-400">종료일</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => onChangeDateRange({ startDate, endDate: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-medium text-slate-700"
          />
        </div>
      </div>
    </div>
  );
}
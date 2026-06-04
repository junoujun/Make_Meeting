// src/components/Home.tsx
import type { PageState } from "../App";

type LoginProps = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageState>>;
};

export default function Home({ setCurrentPage }: LoginProps) {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 bg-slate-50/30">
      {/* 서비스 로고 및 메인 카피 */}
      <div className="mb-12 space-y-3">
        <span className="text-5xl inline-block animate-bounce duration-1000">
          🎈
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
          놀래말래?
        </h1>
        <p className="text-sm sm:text-base font-medium text-slate-500 max-w-sm mx-auto">
          말만 하지 말고 우리{" "}
          <span className="text-blue-600 font-bold underline underline-offset-4">
            진짜
          </span>{" "}
          만나서 놀자!
        </p>
      </div>

      {/* 직관적인 카드형 버튼 박스 */}
      <div className="w-full max-w-sm flex flex-col gap-3.5">
        <button
          onClick={() => setCurrentPage("Make")}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
        >
          ✨ 새로운 약속 생성하기
        </button>

        <button
          onClick={() => setCurrentPage("Join")}
          className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold py-4 px-6 rounded-2xl text-sm transition-all border border-slate-200/80 shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
        >
          🔑 코드로 입장하기
        </button>
      </div>
    </div>
  );
}

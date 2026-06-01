import type { PageState } from "../../App";

type LoginProps = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageState>>;
};

export default function Home({ setCurrentPage }: LoginProps) {
  return (
    <>
      <div className="Index-Page">
        <h1 className="Home_H1">
          놀래말래?
          <br />
          말만 하지 말고
          <br />
          진짜 놀자!
        </h1>
        <div className="button-box">
          <button onClick={() => setCurrentPage("Make")}>
            새로운 약속 잡기
          </button>
          <button onClick={() => setCurrentPage("Join")}>
            코드로 입장하기
          </button>
        </div>
      </div>
    </>
  );
}

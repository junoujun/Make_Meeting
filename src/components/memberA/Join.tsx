import type { PageState } from "../../App";

type LoginProps = {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageState>>;
};

export default function Join({ setCurrentPage }: LoginProps) {
  return (
    <>
      <button onClick={() => setCurrentPage("Home")}>
        <h1>놀래말래?</h1>
      </button>
      <h1>방 입장하기</h1>
      <input type="text"></input>
    </>
  );
}

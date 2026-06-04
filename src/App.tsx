import { useState } from "react";
import Home from "./components/memberA/Home";
import Join from "./components/memberA/Join";
import Make from "./components/memberA/Make";
import Meeting_Details from "./components/memberA/Meeting_Details";

export type PageState =
  | "Home"
  | "Join"
  | "Make"
  | "Bucket_List"
  | "Meeting_Details";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageState>("Home");

  return (
    <>
      {currentPage === "Home" && <Home setCurrentPage={setCurrentPage} />}
      {currentPage === "Join" && <Join setCurrentPage={setCurrentPage} />}
      {currentPage === "Make" && <Make setCurrentPage={setCurrentPage} />}
      {currentPage === "Meeting_Details" && (
        <Meeting_Details setCurrentPage={setCurrentPage} />
      )}
    </>
  );
}

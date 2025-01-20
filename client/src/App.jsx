import { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Pages from "./pages/Pages";
import { useCookies } from "react-cookie";

function App() {
  const [cookies] = useCookies(["adminToken"]);

  useEffect(() => {
    if (!cookies.adminToken) {
      window.location.href = "http://localhost:5173/login";
    }
  }, []);

  return (
    <>
      <div className="grid gap-4 grid-cols-[320px,_1fr]">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
        <Pages />
      </div>
    </>
  );
}

export default App;

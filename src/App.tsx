import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ProgressProvider } from "./store";
import { SessionProvider } from "./session";
import { BottomNav } from "./components/BottomNav";
import { StudioLot } from "./components/StudioLot";
import { MyMovies } from "./components/MyMovies";
import { MovieDetail } from "./components/MovieDetail";
import { AwardsScreen } from "./components/AwardsScreen";
import { PracticeFlow } from "./components/PracticeFlow";
import { CrawlingReptiles } from "./components/CrawlingReptiles";

function Layout() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden relative">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <ProgressProvider>
      <SessionProvider>
        <BrowserRouter>
          <CrawlingReptiles />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<StudioLot />} />
              <Route path="/movies" element={<MyMovies />} />
              <Route path="/movies/:table" element={<MovieDetail />} />
              <Route path="/awards" element={<AwardsScreen />} />
            </Route>
            <Route path="/practice" element={<PracticeFlow />} />
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </ProgressProvider>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import Layout from "./general/components/Layout";
import Home from "./general/home";
import About from "./general/About";
import Login from "./general/Login";
import Register from "./general/Register";
import LearnMore from "./general/Learn";
import AccountInfo from "./general/AccountInfo";
import PlayDash from "./chess/ui/PlayDash";
import GamePage from "./chess/ui/GamePage";


export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/learn" element={<LearnMore />} />
        <Route path="/play" element={<PlayDash />} />
        <Route path="/account" element={<AccountInfo />} />
        <Route path="/game" element={<GamePage />} />
      </Route>
    </Routes>
  );
}

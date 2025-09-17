import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

import '../../css/peripherals-menu.css';
import '../../css/general.css';
import '../../css/header.css';
import '../../css/home-hero.css';
import '../../css/home-learn.css';
import '../../css/home-about.css';
import '../../css/footer.css';
import '../../css/cta-section.css';
import '../../css/form.css';
import '../../css/hero.css';
import '../../css/PlayDash.css';
import '../../css/account.css';
import '../../css/GamePage.css';
import '../../css/Board.css';
import '../../css/captured-pieces.css';
import '../../css/pop-up.css';
import '../../css/promotion-menu.css';
import '../../css/start-game-form.css';
import '../../css/learn-page.css';

export default function Layout() {
  return (
    <>
        <Header />
            <>
                <Outlet />
            </>
        <Footer />
    </>
  );
}

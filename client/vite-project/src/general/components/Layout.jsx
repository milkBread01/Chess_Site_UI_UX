import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
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

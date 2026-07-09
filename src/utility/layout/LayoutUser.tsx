import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

export default function LayoutUser() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

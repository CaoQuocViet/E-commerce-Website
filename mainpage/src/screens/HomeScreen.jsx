import React from "react";
import Header from "../components/Header";
import ShopSection from "../components/Home/ShopSection";
import ContactInfo from "../components/Home/ContactInfo";
import CalltoActionSection from "../components/Home/CalltoActionSection";
import Footer from "../components/Footer";

const HomeScreen = ({ match }) => {
  window.scrollTo(0, 0);
  const keyword = match.params.keyword;
  const pagenumber = match.params.pagenumber;
  return (
    <div>
      <Header advanceCheck={false} />
      <CalltoActionSection />
      <ShopSection keyword={keyword} pagenumber={pagenumber} />
      <ContactInfo />
      <Footer />
    </div>
  );
};

export default HomeScreen;

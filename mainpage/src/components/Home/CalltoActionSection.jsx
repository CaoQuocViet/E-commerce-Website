import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import {
  Navigation,
  Pagination,
  Mousewheel,
  Keyboard,
  Autoplay,
} from "swiper/modules";
import { Link } from "react-router-dom";

const CalltoActionSection = () => {
  return (
    <div className="banner-section d-flex justify-content-center align-items-center">
      <Swiper
        cssMode={true}
        navigation={true}
        pagination={true}
        mousewheel={true}
        keyboard={true}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          loop: true,
        }}
        modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
        className="banner"
        loop={true}
      >
        <SwiperSlide className="banner-slide">
          <Link to="/products/649731aafddebc9c093f53d6">
            <img src="/images/banner/1.png" alt="" />{" "}
          </Link>
        </SwiperSlide>
        <SwiperSlide className="banner-slide">
          <Link to="products/64ae690c02776326d6a2ff34">
            <img src="/images/banner/2.png" alt="" />
          </Link>
        </SwiperSlide>
        <SwiperSlide className="banner-slide">
          <Link to="/products/64ae68be02776326d6a2ff30">
            <img src="/images/banner/3.png" alt="" />
          </Link>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default CalltoActionSection;

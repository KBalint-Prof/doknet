"use client";

import Image from "next/image";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "./carousel.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const images = [
  "/slider/slide1.jpg",
  "/slider/slide2.jpg",
  "/slider/slide3.jpg",
];

export default function Carousel() {
  const swiperRef = useRef<SwiperType | null>(null);

  const logoBaseStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 30,
    pointerEvents: "none",

    width: "20%", // responsive width instead of fixed px
    aspectRatio: "1 / 1", // keeps it square
    borderRadius: "24px",
    padding: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.02)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "0 clamp(1rem, 5vw, 25%)",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "clamp(22px, 4vw, 36px)",
          fontWeight: 700,
          marginBottom: 32,
          letterSpacing: "0.05em",
        }}
      >
        Üdvözlünk!
      </h1>

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 1000,
          margin: "0 auto",
          aspectRatio: "16 / 9",
        }}
      >
        {/* BAL LOGÓ (SZTGJ) - Párhuzamos keretben */}
        <div
          style={{ ...logoBaseStyle, left: "-35%" }}
          className="desktop-logo"
        >
          <Image
            src="/logo/sztjglogo.png"
            alt="SZTGJ logo"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        {/* JOBB LOGÓ (DOK) - Párhuzamos keretben */}
        <div
          style={{ ...logoBaseStyle, right: "-35%" }}
          className="desktop-logo"
        >
          <Image
            src="/logo/doklogo2.png"
            alt="DOK logo"
            fill
            style={{ objectFit: "contain", mixBlendMode: "multiply" }}
            priority
          />
        </div>

        <Swiper
          modules={[EffectFade, Autoplay, Navigation, Pagination]}
          navigation
          pagination={true}
          effect="fade"
          speed={800}
          loop
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          style={{
            height: "100%",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
          }}
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Image
                  src={src}
                  alt={`Slide ${index + 1}`}
                  fill
                  priority={index === 0}
                  style={{ objectFit: "cover" }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

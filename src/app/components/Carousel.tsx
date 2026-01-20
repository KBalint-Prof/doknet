"use client";

import Image from "next/image";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/effect-fade";

const images = [
  "/slider/slide1.jpg",
  "/slider/slide2.jpg",
  "/slider/slide3.jpg",
];

export default function Carousel() {
  const swiperRef = useRef<SwiperType | null>(null);

  // Egységesített, magasított konténer stílus a párhuzamos megjelenéshez
  const logoBaseStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 30,
    pointerEvents: "none",

    // Fix, egyforma méretek a párhuzamossághoz
    width: "480px",
    height: "480px",

    borderRadius: "24px",
    padding: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
   

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const arrowStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 40,
    background: "rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(4px)",
    border: "none",
    color: "#fff",
    fontSize: 52,
    fontWeight: 800,
    cursor: "pointer",
    padding: "10px",
    borderRadius: "50%",
    width: "64px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    // Megnövelt padding a hatalmas, párhuzamos kereteknek
    <div
      style={{
        width: "100%",
        padding: "0 25%",
        boxSizing: "border-box",
        overflow: "visible",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: 36,
          fontWeight: 700,
          marginBottom: 40,
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
        <div style={{ ...logoBaseStyle, left: "-60%" }}>
          <Image
            src="/logo/sztjglogo.png"
            alt="SZTGJ logo"
            width={440}
            height={440}
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        {/* JOBB LOGÓ (DOK) - Párhuzamos keretben */}
        <div style={{ ...logoBaseStyle, right: "-60%" }}>
          <Image
            src="/logo/doklogo2.png"
            alt="DOK logo"
            width={400}
            height={400}
            style={{ objectFit: "contain", mixBlendMode: "multiply" }}
            priority
          />
        </div>

        {/* NAVIGÁCIÓ */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          style={{ ...arrowStyle, left: 20 }}
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          style={{ ...arrowStyle, right: 20 }}
        >
          ›
        </button>

        <Swiper
          modules={[EffectFade, Autoplay]}
          effect="fade"
          speed={800}
          loop
          autoplay={{ delay: 4500, disableOnInteraction: false }}
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
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                <Image
                  src={src}
                  alt={`Slide ${index + 1}`}
                  fill
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

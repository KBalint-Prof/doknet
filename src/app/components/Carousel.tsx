"use client";

import Image from "next/image";
import { useRef, useState } from "react";
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
  "/slider/slide5.jpg",
];

export default function Carousel() {
  const swiperRef = useRef<SwiperType | null>(null);

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % images.length);
    }
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + images.length) % images.length);
    }
  };

  const logoBaseStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 30,
    pointerEvents: "none",
    width: "20%",
    aspectRatio: "1 / 1",
    padding: "10px",
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
        <div
          style={{ ...logoBaseStyle, left: "-35%" }}
          className="desktop-logo"
        >
          <Image
            src="/logo/sztjglogo.png"
            alt="SZTGJ"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <div
          style={{ ...logoBaseStyle, right: "-35%" }}
          className="desktop-logo"
        >
          <Image
            src="/logo/doklogo2.png"
            alt="DOK"
            fill
            style={{ objectFit: "contain", mixBlendMode: "multiply" }}
          />
        </div>

        <Swiper
          modules={[EffectFade, Autoplay, Navigation, Pagination]}
          navigation
          pagination={true}
          effect="fade"
          loop
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          style={{ height: "100%", borderRadius: 24, overflow: "hidden" }}
        >
          {images.map((src, index) => (
            <SwiperSlide
              key={index}
              onClick={() => setSelectedIdx(index)}
              style={{ cursor: "zoom-in" }}
            >
              <Image
                src={src}
                alt="slide"
                fill
                style={{ objectFit: "cover", pointerEvents: "none" }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {selectedIdx !== null && (
        <div
          onClick={() => setSelectedIdx(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "20px",
              right: "30px",
              color: "white",
              fontSize: "50px",
              cursor: "pointer",
              zIndex: 10001,
            }}
          >
            &times;
          </span>

          <button onClick={prevImg} style={navButtonStyle(true)}>
            &#10094;
          </button>

          <div
            style={{ position: "relative", width: "80%", height: "80%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIdx]}
              alt="nagy"
              fill
              style={{ objectFit: "contain" }}
              unoptimized
            />
          </div>

          <button onClick={nextImg} style={navButtonStyle(false)}>
            &#10095;
          </button>
        </div>
      )}
    </div>
  );
}

const navButtonStyle = (isLeft: boolean): React.CSSProperties => ({
  position: "absolute",
  top: "50%",
  [isLeft ? "left" : "right"]: "20px",
  transform: "translateY(-50%)",
  background: "rgba(255,255,255,0.1)",
  border: "none",
  color: "white",
  fontSize: "40px",
  padding: "20px",
  cursor: "pointer",
  borderRadius: "50%",
  zIndex: 10002,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.3s",
});

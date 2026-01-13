'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-fade';

const images = [
  '/slider/slide1.jpg',
  '/slider/slide2.jpg',
  '/slider/slide3.jpg',
];

export default function Carousel() {
  const swiperRef = useRef<SwiperType | null>(null);

  const arrowStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 10,
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: 52,
    fontWeight: 800,
    cursor: 'pointer',
    userSelect: 'none',
    lineHeight: 1,
    textShadow: '0 4px 16px rgba(0,0,0,0.8)',
    padding: 0,
  };

  return (
    <div style={{ width: '100%' }}>
      {/* FELIRAT A KÉPEK FÖLÖTT */}
      <h1
        style={{
          textAlign: 'center',
          fontSize: 32,
          fontWeight: 600,
          marginBottom: 16,
          letterSpacing: '0.05em',
        }}
      >
        Üdvözlünk!
      </h1>

      {/* CAROUSEL */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 900,
          margin: '0 auto',
          aspectRatio: '16 / 9',
          overflow: 'hidden',
          borderRadius: 12,
        }}
      >
        {/* BAL NYÍL */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Előző kép"
          style={{ ...arrowStyle, left: 12 }}
        >
          ‹
        </button>

        {/* JOBB NYÍL */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Következő kép"
          style={{ ...arrowStyle, right: 12 }}
        >
          ›
        </button>

        <Swiper
          modules={[EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={600}
          loop
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          style={{ height: '100%' }}
        >
          {images.map((src, index) => (
            <SwiperSlide key={index} style={{ height: '100%' }}>
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image
                  src={src}
                  alt={`Slide ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 900px) 100vw, 900px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

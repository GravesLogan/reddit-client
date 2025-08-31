import React, { useState } from 'react';
import styles from '../styles/imageGallery.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageGallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className={styles.buttons}>
      <button onClick={goPrev}>
        <ChevronLeft size={40} color="white" />
      </button>
      <img
        className={styles.image}
        src={images[currentIndex]}
        alt={`Gallery ${currentIndex + 1}`}
      />
      <button onClick={goNext}>
        <ChevronRight size={40} color="white" />
      </button>
    </div>
  );
}

'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductImage } from '@/types';
import { getPlaceholderImage, cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const ZOOM_LEVEL = 2.5; // How much to magnify

  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.displayOrder - b.displayOrder;
  });

  const displayImages = sortedImages.length > 0
    ? sortedImages
    : [{ id: 'placeholder', imageUrl: getPlaceholderImage(600, 600, productName), alt: productName, isPrimary: true, displayOrder: 0 }];

  const currentImage = displayImages[selectedIndex];

  const goToPrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    setIsHovering(false);
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    setIsHovering(false);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setBgPos({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  // Lens size (the small square that follows the cursor)
  const lensSize = 120;

  return (
    <div className="space-y-4">
      {/* Main image + zoom panel wrapper */}
      <div className="relative flex gap-4">
        {/* Main image container */}
        <div
          ref={imageContainerRef}
          className="relative aspect-square rounded-xl overflow-hidden bg-[hsl(0,0%,8%)] group flex-1 cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={currentImage.imageUrl}
                alt={currentImage.alt || productName}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
                unoptimized={currentImage.imageUrl.includes('placehold.co')}
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* Lens overlay (visible square that follows mouse on desktop) */}
          {isHovering && (
            <div
              className="hidden lg:block absolute pointer-events-none border-2 border-accent-500/60 bg-accent-500/10 z-10 rounded-sm"
              style={{
                width: lensSize,
                height: lensSize,
                left: Math.max(0, Math.min(mousePos.x - lensSize / 2, (imageContainerRef.current?.clientWidth || 0) - lensSize)),
                top: Math.max(0, Math.min(mousePos.y - lensSize / 2, (imageContainerRef.current?.clientHeight || 0) - lensSize)),
              }}
            />
          )}

          {/* Navigation arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition hover:bg-black/80 text-white z-20"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition hover:bg-black/80 text-white z-20"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Zoom hint */}
          {!isHovering && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition z-20">
              <ZoomIn size={14} className="text-white" />
              <span className="text-[11px] text-white/80 font-medium hidden lg:inline">Hover to zoom</span>
            </div>
          )}

          {/* Image counter */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white font-medium z-20">
              {selectedIndex + 1} / {displayImages.length}
            </div>
          )}
        </div>

        {/* Zoomed panel (appears to the right on desktop) */}
        {isHovering && (
          <div
            className="hidden lg:block absolute left-[calc(100%+16px)] top-0 w-[400px] aspect-square rounded-xl overflow-hidden border border-white/10 bg-[hsl(0,0%,8%)] shadow-2xl shadow-black/50 z-50"
            style={{
              backgroundImage: `url(${currentImage.imageUrl})`,
              backgroundSize: `${ZOOM_LEVEL * 100}%`,
              backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
          {displayImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => { setSelectedIndex(index); setIsHovering(false); }}
              className={cn(
                'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition',
                selectedIndex === index
                  ? 'border-accent-500 shadow-md'
                  : 'border-transparent hover:border-white/20'
              )}
            >
              <Image
                src={image.imageUrl}
                alt={image.alt || `${productName} ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
                unoptimized={image.imageUrl.includes('placehold.co')}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

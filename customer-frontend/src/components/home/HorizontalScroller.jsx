// customer-frontend/src/components/home/HorizontalScroller.jsx

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HorizontalScroller = ({ children, className = "" }) => {
  const scrollerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateScrollState();

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    // Content can change width after images/data load in, so watch for that too
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      observer.disconnect();
    };
  }, [children, updateScrollState]);

  const scrollByPage = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.75, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {canScrollLeft && (
        <>
          <div className="pointer-events-none absolute left-0 top-0 bottom-2 w-10 bg-gradient-to-r from-white to-transparent z-10" />
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            aria-label="Scroll left"
            className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full
                       bg-white shadow-md border border-gray-100 items-center justify-center text-gray-500
                       hover:text-primary hover:shadow-lg transition-shadow"
          >
            <ChevronLeft size={18} />
          </button>
        </>
      )}

      {canScrollRight && (
        <>
          <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-10 bg-gradient-to-l from-white to-transparent z-10" />
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            aria-label="Scroll right"
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full
                       bg-white shadow-md border border-gray-100 items-center justify-center text-gray-500
                       hover:text-primary hover:shadow-lg transition-shadow"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      <div
        ref={scrollerRef}
        className={`flex gap-4 overflow-x-auto scroll-smooth snap-x snap-proximity pb-2 -mx-1 px-1
                    [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default HorizontalScroller;
import { useState, useEffect, useRef } from "react";

export function useSectionFocus(sectionsLength) {
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef([]);

  useEffect(() => {
    sectionRefs.current = Array(sectionsLength)
      .fill(null)
      .map((_, i) => sectionRefs.current[i] || { current: null });
  }, [sectionsLength]);

  useEffect(() => {
    const handleScroll = () => {
      let currentIdx = 0;

      sectionRefs.current.forEach((ref, idx) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        // 64 = hauteur header
        if (rect.top <= 70) {
          currentIdx = idx;
        }
      });

      setActiveSection(currentIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionsLength]);

  return {
    sectionRefs,
    activeSection,
    setActiveSection,
  };
}

const SectionsSidebar = ({
  sections,
  sectionRefs,
  activeSection,
  setActiveSection,
}) => {
  if (!sections?.length) return null;

  const scrollToSection = (idx) => {
    setActiveSection(idx);

    setTimeout(() => {
      const ref = sectionRefs.current[idx];
      if (!ref?.current) return;

      const HEADER_OFFSET = -64;

      const y =
        ref.current.getBoundingClientRect().top +
        window.pageYOffset +
        HEADER_OFFSET;

      window.scrollTo({ top: y, behavior: "smooth" });
    }, 50);
  };

  return (
    <div
      className="position-fixed top-50 end-0 translate-middle-y z-3 bg-body border rounded-start shadow-sm p-2"
      style={{ opacity: 0.85 }}
    >
      <div className="fw-semibold mb-2 small d-none d-md-block text-center">
        Sections
      </div>

      <div className="d-flex flex-column gap-1">
        {sections.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => scrollToSection(idx)}
            className={`btn btn-sm ${
              activeSection === idx ? "btn-primary" : "btn-outline-secondary"
            }`}
            title={`Aller à la section ${idx + 1}`}
          >
            {/* Desktop */}
            <span className="d-none d-md-inline">Sec-{idx + 1}</span>

            {/* Mobile */}
            <span className="d-inline d-md-none">{idx + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SectionsSidebar;

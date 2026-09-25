// customer-frontend/src/components/legal/LegalLayout.jsx

const LegalLayout = ({ title,children }) => (
  <div className="bg-white">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-black text-secondary tracking-tight">{title}</h1>

      <div className="mt-8 space-y-8 text-sm text-gray-600 leading-relaxed">{children}</div>
    </div>
  </div>
);

// Reusable numbered section used inside both legal pages
export const LegalSection = ({ number, title, children }) => (
  <section>
    <h2 className="text-base font-bold text-secondary mb-2">
      {number}. {title}
    </h2>
    <div className="space-y-3">{children}</div>
  </section>
);

export default LegalLayout;
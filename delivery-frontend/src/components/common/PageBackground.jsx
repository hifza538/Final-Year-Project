// delivery-frontend/src/components/common/PageBackground.jsx
const shapes = [
  { top: "2%", left: "3%", size: 42, color: "primary", shape: "circle" },
  { top: "4%", left: "35%", size: 48, color: "gold", shape: "diamond" },
  { top: "1%", left: "88%", size: 54, color: "primary", shape: "circle" },

  { top: "18%", left: "14%", size: 38, color: "primary", shape: "square" },
  { top: "20%", left: "78%", size: 44, color: "gold", shape: "circle" },

  { top: "38%", left: "5%", size: 50, color: "gold", shape: "diamond" },
  { top: "38%", left: "92%", size: 40, color: "primary", shape: "square" },
  { top: "35%", left: "42%", size: 32, color: "primary", shape: "circle" },

  { top: "55%", left: "20%", size: 44, color: "gold", shape: "circle" },
  { top: "55%", left: "85%", size: 44, color: "primary", shape: "diamond" },

  { top: "78%", left: "4%", size: 48, color: "primary", shape: "circle" },
  { top: "80%", left: "45%", size: 38, color: "gold", shape: "square" },
  { top: "78%", left: "90%", size: 50, color: "primary", shape: "circle" },
];

const shapeClasses = {
  circle: "rounded-full",
  square: "rounded-md",
  diamond: "rounded-md rotate-45",
};

const colorMap = {
  primary: "#C2410C",
  gold: "#D4900A",
};

const PageBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white">
      {shapes.map((s, i) => (
        <div
          key={i}
          className={`absolute ${shapeClasses[s.shape]}`}
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            backgroundColor: colorMap[s.color],
            opacity: s.color === "gold" ? 0.45 : 0.4,
          }}
        />
      ))}
    </div>
  );
};

export default PageBackground;
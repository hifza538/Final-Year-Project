// delivery-frontend/src/components/orders/StageProgress.jsx
import { Check } from "lucide-react";
import { STAGE_SEQUENCE, STAGE_LABELS } from "../../utils/deliveryStages";

// This component visually represents the progress of an order through its delivery stages
const StageProgress = ({ currentStage }) => {
  const currentIndex = STAGE_SEQUENCE.indexOf(currentStage);

  return (
    <div className="flex items-center mb-5">
      {STAGE_SEQUENCE.map((stage, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === STAGE_SEQUENCE.length - 1;

        return (
          <div key={stage} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0
                  ${isDone ? "bg-primary text-white" : ""}
                  ${isCurrent ? "bg-primary text-white ring-4 ring-primary-light" : ""}
                  ${!isDone && !isCurrent ? "bg-gray-100 text-gray-400" : ""}
                `}
              >
                {isDone ? <Check size={13} /> : index + 1}
              </div>
              <span
                className={`text-[10px] mt-1 text-center leading-tight w-14
                  ${isCurrent ? "text-primary font-medium" : "text-gray-400"}`}
              >
                {STAGE_LABELS[stage]}
              </span>
            </div>
            {!isLast && (
              <div className={`h-0.5 flex-1 mx-1 ${isDone ? "bg-primary" : "bg-gray-100"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StageProgress;
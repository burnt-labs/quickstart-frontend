import React from "react";
import { BaseButton } from "./BaseButton";

const variants = ["default", "secondary", "destructive", "text"] as const;
const sizes = [
  "default",
  "large",
  "small",
  "text",
  "icon",
  "icon-large",
] as const;

export const ButtonExamples: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Button Variants</h2>
        <div className="grid grid-cols-2 gap-4">
          {variants.map((variant) => (
            <div key={variant} className="space-y-2">
              <h3 className="text-lg font-semibold capitalize">{variant}</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <BaseButton
                    key={`${variant}-${size}`}
                    variant={variant}
                    size={size}
                  >
                    {size === "icon" || size === "icon-large" ? "🔍" : variant}
                  </BaseButton>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">With Back Arrow</h2>
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => (
            <BaseButton key={variant} variant={variant} backArrow>
              {variant}
            </BaseButton>
          ))}
        </div>
      </div>
    </div>
  );
};

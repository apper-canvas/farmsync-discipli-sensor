import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";

const RadioGroup = React.forwardRef(({ 
  className, 
  options = [],
  value,
  onChange,
  name,
  error,
  ...props 
}, ref) => {
  return (
    <div className={cn("space-y-2", className)} ref={ref} {...props}>
      {options.map((option) => {
        const optionValue = typeof option === 'string' ? option : option.value;
        const optionLabel = typeof option === 'string' ? option : option.label;
        const isSelected = value === optionValue;
        
        return (
          <Card 
            key={optionValue}
            hover={false}
            className={cn(
              "cursor-pointer transition-all duration-200 border-2",
              isSelected 
                ? "border-primary-500 bg-primary-50 shadow-md" 
                : "border-gray-100 hover:border-gray-200 hover:shadow-sm",
              error && "border-error"
            )}
            onClick={() => onChange?.(optionValue)}
          >
            <div className="flex items-center p-4">
              <input
                type="radio"
                name={name}
                value={optionValue}
                checked={isSelected}
                onChange={() => onChange?.(optionValue)}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 mr-3"
              />
              <label className="flex-1 cursor-pointer font-medium text-gray-900">
                {optionLabel}
              </label>
            </div>
          </Card>
        );
      })}
    </div>
  );
});

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;
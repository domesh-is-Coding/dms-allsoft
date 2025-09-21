import * as React from "react";
import { cn } from "@/lib/utils";

const Select = React.forwardRef(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "border rounded-lg px-3 py-2 w-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500",
      className
    )}
    {...props}
  />
));
Select.displayName = "Select";

export { Select };

export function SelectTrigger({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function SelectValue({ placeholder }) {
  return <option value="">{placeholder}</option>;
}

export function SelectContent({ children }) {
  return <>{children}</>;
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}

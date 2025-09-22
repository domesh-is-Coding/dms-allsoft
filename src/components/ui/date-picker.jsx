import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({
  date,
  setDate,
  className,
  placeholder = "Pick a date",
  ...props
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (selectedDate) => {
    setDate(selectedDate);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-8 sm:h-10 justify-start text-left font-normal border-gray-300 hover:border-gray-400 transition-colors",
            !date && "text-gray-500",
            className
          )}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
          {date ? (
            <span className="text-gray-900">{format(date, "PPP")}</span>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

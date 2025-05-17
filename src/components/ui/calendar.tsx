import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 mx-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 justify-center",
        month: "space-y-4 w-full",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-mood-color",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-7 w-7 flex items-center justify-center rounded-full shadow-neo-convex hover:shadow-neo-mood-convex active:shadow-neo-pressed transition-all",
          "bg-transparent p-0"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1 mx-auto",
        head_row: "flex justify-center",
        head_cell:
          "text-neo-text rounded-md w-9 font-normal text-[0.8rem] text-center",
        row: "flex w-full mt-2 justify-center",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          "h-8 w-8 p-0 font-normal rounded-full flex items-center justify-center m-auto transition-all",
          "hover:shadow-neo-mood-convex hover:bg-neo-mood-hover"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-neo-mood text-white shadow-neo-mood-pressed hover:bg-neo-mood hover:text-white focus:bg-neo-mood focus:text-white",
        day_today: "bg-neo-flat text-mood-color font-medium",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4 text-mood-color" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4 text-mood-color" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, DropdownProps } from "react-day-picker"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const CustomDropdown = ({ value, onChange, children }: DropdownProps) => {
    const options = React.Children.toArray(children) as React.ReactElement<{ value: number | string; children: React.ReactNode }>[]

    return (
      <select
        value={value}
        onChange={(e) => onChange?.(e)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-base bg-white hover:bg-gray-50 font-medium cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.props.value} value={option.props.value}>
            {option.props.children}
          </option>
        ))}
      </select>
    )
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col",
        month: "space-y-4",
        caption: "flex justify-between items-center mb-4 relative",
        caption_label: "hidden",
        caption_dropdowns: "flex gap-3 absolute left-1/2 -translate-x-1/2 z-10",
        nav: "flex justify-between w-full",
        nav_button: "h-8 w-8 bg-white p-0 hover:bg-gray-100 rounded flex items-center justify-center z-10",
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse",
        head_row: "flex mb-2",
        head_cell: "text-gray-600 w-10 font-normal text-sm text-center",
        row: "flex w-full",
        cell: "h-10 w-10 text-center text-sm p-0",
        day: "h-10 w-10 p-0 font-normal hover:bg-gray-100 rounded text-gray-900",
        day_selected: "bg-black text-white hover:bg-black",
        day_outside: "text-gray-500 opacity-100",
        day_disabled: "text-gray-400 opacity-100",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-5 w-5 " />,
        IconRight: () => <ChevronRight className="h-5 w-5" />,
        Dropdown: CustomDropdown,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

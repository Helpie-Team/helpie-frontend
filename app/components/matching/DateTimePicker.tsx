"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface DateTimePickerProps {
  label?: string;
  required?: boolean;
  dateValue?: Date;
  timeValue?: string;
  onDateChange?: (date: Date | undefined) => void;
  onTimeChange?: (time: string) => void;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  required,
  dateValue,
  timeValue = "",
  onDateChange,
  onTimeChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    onDateChange?.(date);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="block text-body2-medium text-grayScale-900">
          {required && <span className="text-key-100 mr-1">*</span>}
          {label}
        </label>
      )}

      <div className="flex gap-4">
        {/* Date 선택 */}
        <div className="flex-1 flex flex-col gap-2">
          <Label htmlFor="date-picker" className="text-body3-regular text-grayScale-900">
            Date
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker"
                className="w-full px-4 py-3 h-auto border-grayScale-200 rounded-xl text-body1 justify-start font-normal text-grayScale-900 bg-white hover:bg-white"
              >
                {dateValue ? (
                  format(dateValue, "yyyy. MM. dd.", { locale: ko })
                ) : (
                  <span className="text-grayScale-300">날짜 선택</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-grayScale-200 rounded-xl bg-white" align="start">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={handleDateSelect}
                locale={ko}
                captionLayout="dropdown-buttons"
                fromYear={2025}
                toYear={2030}
                fromDate={new Date(2025, 0, 1)}
                toDate={new Date(2030, 11, 31)}
                showOutsideDays
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time 선택 */}
        <div className="flex-1 flex flex-col gap-2">
          <Label htmlFor="time-picker" className="text-body3-regular text-grayScale-900">
            Time
          </Label>
          <Input
            type="time"
            id="time-picker"
            value={timeValue}
            onChange={(e) => onTimeChange?.(e.target.value)}
            className="px-4 py-3 h-auto border-grayScale-200 rounded-xl text-body1 bg-white [&::-webkit-calendar-picker-indicator]:hidden"
          />
        </div>
      </div>
    </div>
  );
};

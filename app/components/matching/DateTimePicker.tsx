"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronDown } from "lucide-react";

interface DateTimePickerProps {
  label?: string;
  required?: boolean;
  dateValue?: Date;
  timeValue?: string;
  onDateChange?: (date: Date | undefined) => void;
  onTimeChange?: (time: string) => void;
}

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 ? "30" : "00";
  return `${h.toString().padStart(2, "0")}:${m}`;
});

const formatTimeLabel = (v: string) => {
  if (!v) return "";
  const [h, m] = v.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return v;

  const ampm = h < 12 ? "오전" : "오후";
  const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${ampm} ${hh.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}`;
};

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  required,
  dateValue,
  timeValue = "",
  onDateChange,
  onTimeChange,
}) => {
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  // 오늘 이전 날짜 비활성화용
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleDateSelect = (date: Date | undefined) => {
    onDateChange?.(date);
    setDateOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="text-body2-medium text-grayScale-900">
          {required && <span className="text-key-100 mr-1">*</span>}
          {label}
        </label>
      )}

      <div className="flex gap-4">
        {/* Date */}
        <div className="flex-1 flex flex-col gap-2">
          <Label
            htmlFor="date-picker"
            className="text-body3-regular text-grayScale-900"
          >
            Date
          </Label>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker"
                type="button"
                className={`
                  w-full px-4 py-3 h-auto border-grayScale-200 rounded-xl
                  text-body1 justify-start font-normal relative
                  bg-white hover:bg-white
                  ${!dateValue && "text-grayScale-300"}
                `}
              >
                {dateValue ? (
                  format(dateValue, "yyyy. MM. dd.", { locale: ko })
                ) : (
                  "날짜 선택"
                )}
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-black" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 border-grayScale-200 rounded-xl bg-white"
              align="start"
            >
              <Calendar
  mode="single"
  selected={dateValue}
  onSelect={handleDateSelect}
  locale={ko}
  // ⬇️ 여기 추가
  captionLayout="dropdown-buttons"
  fromYear={today.getFullYear()}
  toYear={2030}
  fromDate={today}
  toDate={new Date(2030, 11, 31)}
  showOutsideDays
  disabled={(date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < today;       // 오늘 이전 선택 불가
  }}
  initialFocus
/>
            </PopoverContent>
          </Popover>
        </div>

        {/* Time */}
        <div className="flex-1 flex flex-col gap-2">
          <Label
            htmlFor="time-input"
            className="text-body3-regular text-grayScale-900"
          >
            Time
          </Label>
          <Popover open={timeOpen} onOpenChange={setTimeOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`
                  w-full px-4 py-3 rounded-xl border border-grayScale-300
                  text-body1 text-left relative
                  bg-white hover:bg-white
                  ${!timeValue && "text-grayScale-300"}
                `}
              >
                {timeValue ? formatTimeLabel(timeValue) : "시간 선택"}
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-black" />
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] max-h-[240px] overflow-y-auto border rounded-xl bg-white p-1">
              <input
                id="time-input"
                placeholder="직접 입력 (HH:mm)"
                value={timeValue}
                onChange={(e) => onTimeChange?.(e.target.value)}
                className="w-full px-3 py-2 text-body2 border border-grayScale-200 rounded-lg mb-2"
              />
              {TIME_OPTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    onTimeChange?.(t);
                    setTimeOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md
                    ${
                      t === timeValue
                        ? "bg-key-100 text-white"
                        : "hover:bg-grayScale-100"
                    }`}
                >
                  {formatTimeLabel(t)}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

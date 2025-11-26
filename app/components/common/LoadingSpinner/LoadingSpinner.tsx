// LoadingSpinner.tsx
"use client";

import React from "react";
import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  /** 스피너 크기 */
  size?: "small" | "medium" | "large";
  /** 스피너 색상 */
  color?: string;
  /** 컨테이너에 추가할 클래스 */
  className?: string;
  /** 텍스트 표시 여부 */
  showText?: boolean;
  /** 커스텀 텍스트 */
  text?: string;
}

const sizeMap = {
  small: "12px",
  medium: "16px",
  large: "24px"
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = "#f97316", 
  className = "",
  showText = false,
  text = "로딩 중...",
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <span
          className={styles.loader}
          style={{
            fontSize: sizeMap[size],
            color,
          }}
        >
          Loading...
        </span>
        {showText && (
          <span className="text-sm text-gray-600 font-medium">
            {text}
          </span>
        )}
      </div>
    </div>
  );
};

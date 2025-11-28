'use client';

import React from 'react';

interface ProfileInfoRowProps {
  label: string;
  children: React.ReactNode;
  align?: 'center' | 'start';
}

export function ProfileInfoRow({ label, children, align = 'center' }: ProfileInfoRowProps) {
  return (
    <div className={`flex flex-row justify-between sm:justify-start items-center gap-2 sm:gap-7 ${align === 'start' ? 'items-start' : 'items-center'}`}>
      <span className={`text-body2 text-grayScale-700 ${align === 'start' ? 'pt-1' : ''} flex-shrink-0`}>
        {label}
      </span>
      <div className="text-right sm:text-left">
        {children}
      </div>
    </div>
  );
}


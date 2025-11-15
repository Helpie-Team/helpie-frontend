'use client';

import React from 'react';

interface ProfileInfoRowProps {
  label: string;
  children: React.ReactNode;
  align?: 'center' | 'start';
}

export function ProfileInfoRow({ label, children, align = 'center' }: ProfileInfoRowProps) {
  return (
    <div className={`flex gap-7 ${align === 'start' ? 'items-start' : 'items-center'}`}>
      <span className={`w-[91px] text-body2 text-grayScale-700 ${align === 'start' ? 'pt-1' : ''}`}>
        {label}
      </span>
      {children}
    </div>
  );
}


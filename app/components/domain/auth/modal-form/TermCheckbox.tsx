import React from 'react';

interface TermCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  badge: {
    text: string;
    type: 'required' | 'optional';
  };
}

export function TermCheckbox({ 
  id, 
  checked, 
  onChange, 
  label, 
  badge 
}: TermCheckboxProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor={id} className="ml-2 text-sm text-gray-700">
          {label}
        </label>
      </div>
      <span 
        className={`${
          badge.type === 'required' 
            ? 'bg-orange-500' 
            : 'bg-gray-500'
        } text-white text-xs px-2 py-1 rounded-full`}
      >
        {badge.text}
      </span>
    </div>
  );
}

interface TermsAgreementProps {
  agreements: {
    all: boolean;
    privacyPolicy: boolean;
    locationInfo: boolean;
    marketing: boolean;
  };
  onAllAgreementChange: (checked: boolean) => void;
  onPrivacyPolicyChange: (checked: boolean) => void;
  onLocationInfoChange: (checked: boolean) => void;
  onMarketingChange: (checked: boolean) => void;
}

export function TermsAgreement({
  agreements,
  onAllAgreementChange,
  onPrivacyPolicyChange,
  onLocationInfoChange,
  onMarketingChange,
}: TermsAgreementProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-4">서비스 이용 동의</h3>
      
      {/* 모두동의 */}
      <div className="flex items-center mb-3">
        <input
          type="checkbox"
          id="all"
          checked={agreements.all}
          onChange={(e) => onAllAgreementChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="all" className="ml-2 text-sm font-medium text-gray-700">
          모두동의
        </label>
      </div>

      {/* 개별 약관들 */}
      <div className="space-y-3">
        <TermCheckbox
          id="privacyPolicy"
          checked={agreements.privacyPolicy}
          onChange={onPrivacyPolicyChange}
          label="필수 개인정보 수집/이용에 관한 약관"
          badge={{ text: '필수', type: 'required' }}
        />

        <TermCheckbox
          id="locationInfo"
          checked={agreements.locationInfo}
          onChange={onLocationInfoChange}
          label="필수 위치정보 이용 약관"
          badge={{ text: '필수', type: 'required' }}
        />

        <TermCheckbox
          id="marketing"
          checked={agreements.marketing}
          onChange={onMarketingChange}
          label="선택 마케팅 및 서비스 이용 알림 동의"
          badge={{ text: '선택', type: 'optional' }}
        />
      </div>
    </div>
  );
}

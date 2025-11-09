"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import plus from '@/public/icons/plus.png';

// 공통 스타일
const INPUT_CLASS = "w-full px-4 py-3 border border-grayScale-200 text-body1 rounded-xl focus:outline-none  placeholder:text-grayScale-300";

export const CATEGORY_OPTIONS = [
  { id: 'culture', label: '문화 · 취미' },
  { id: 'art', label: '예술 · 클래스' },
  { id: 'activity', label: '액티비티 · 라이프' },
  { id: 'study', label: '자기계발 · 공부' },
  { id: 'social', label: '사회 · 친목' },
];

export const CITY_OPTIONS = [
  '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
  '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
  '수원', '성남', '고양', '용인', '부천', '안산', '안양', '남양주', '화성',
  '평택', '의정부', '시흥', '파주', '김포', '광명', '광주시', '군포',
  '하남', '오산', '양주', '이천', '구리', '안성', '포천', '의왕', '양평',
  '여주', '동두천', '가평', '과천', '연천',
];

interface MatchingInputProps {
  type: 'text' | 'textarea' | 'search' | 'number' | 'tags' | 'tag-input' | 'image';
  label?: string;
  required?: boolean;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number | string[] | File[]) => void;
  maxLength?: number;
  minLength?: number;
  showCharCount?: boolean;
  max?: number;
  selectedTags?: string[];
  tags?: string[];
  maxTags?: number;
  options?: Array<{ id: string; label: string }>;
  images?: File[];
  maxImages?: number;
  helperText?: string;
  error?: string;
}

export const MatchingInput: React.FC<MatchingInputProps> = (props) => {
  const { label, required, helperText, error } = props;

  const renderInput = () => {
    switch (props.type) {
      case 'text': return <TextInput {...props} />;
      case 'textarea': return <TextareaInput {...props} />;
      case 'search': return <SearchInput {...props} />;
      case 'number': return <NumberInput {...props} />;
      case 'tags': return <TagsInput {...props} />;
      case 'tag-input': return <TagInputComponent {...props} />;
      case 'image': return <ImageInput {...props} />;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="block text-body3-sb text-grayScale-900">
          {required && <span className="text-key-100 mr-1">*</span>}
          {label}
        </label>
      )}
      {renderInput()}
      {helperText && !error && <p className="text-body3-regular text-black">{helperText}</p>}
    </div>
  );
};

// 텍스트 입력
const TextInput: React.FC<MatchingInputProps> = ({ value = '', onChange, placeholder, maxLength, showCharCount }) => (
  <div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={INPUT_CLASS}
    />
    {showCharCount && maxLength && (
      <p className="text-body3-regular text-grayScale-500 mt-1">최대 {maxLength}자 이내</p>
    )}
  </div>
);

// 텍스트 영역
const TextareaInput: React.FC<MatchingInputProps> = ({
  value = '',
  onChange,
  placeholder,
  maxLength = 500,
  minLength,
  showCharCount = true
}) => (
  <div>
    <textarea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`${INPUT_CLASS} min-h-[120px] resize-none`}
    />
    {showCharCount && (
      <p className="text-body3-regular text-grayScale-500 mt-1">
        {String(value).length} / {maxLength} {minLength && `최소 ${minLength}자 이상`}
      </p>
    )}
  </div>
);

// 지역 검색 입력
const SearchInput: React.FC<MatchingInputProps> = ({ value = '', onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState(CITY_OPTIONS);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange?.(inputValue);
    setIsOpen(true);
    setFilteredCities(CITY_OPTIONS.filter(city => city.toLowerCase().includes(inputValue.toLowerCase())));
  };

  const handleSelectCity = (city: string) => {
    onChange?.(city);
    setIsOpen(false);
    setFilteredCities(CITY_OPTIONS);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder={placeholder}
        className={INPUT_CLASS}
      />

      {/* 드롭다운 */}
      {isOpen && value && filteredCities.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-grayScale-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {filteredCities.map((city, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectCity(city)}
              className="w-full px-4 py-3 text-left hover:bg-grayScale-100 transition-colors text-body2-regular"
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// 숫자 입력
const NumberInput: React.FC<MatchingInputProps> = ({ value = 0, onChange, placeholder }) => (
  <div>
    <input
      type="number"
      value={value || ''}
      onChange={(e) => onChange?.(parseInt(e.target.value) || 0)}
      placeholder={placeholder}
      className={INPUT_CLASS}
    />
    <p className="text-body3-regular text-grayScale-500 mt-1">최소 인원 : 3명</p>
  </div>
);

// 카테고리 태그
const TagsInput: React.FC<MatchingInputProps> = ({ selectedTags = [], onChange, options = CATEGORY_OPTIONS }) => {
  const selectTag = (tagId: string) => {
    onChange?.([tagId]);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const isSelected = selectedTags.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => selectTag(option.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all text-body2-medium ${
              isSelected
                ? 'bg-white text-black border-key-100'
                : 'bg-white text-grayScale-600 border-grayScale-200 hover:border-key-100'
            }`}
          >
            {/* 라디오 버튼 아이콘 */}
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              isSelected ? 'bg-key-100' : 'bg-key-300 border border-grayScale-filter'
            }`}>
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

// 태그 입력
const TagInputComponent: React.FC<MatchingInputProps> = ({ tags = [], onChange, placeholder, maxTags = 10 }) => {
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing && inputValue.trim()) {
      e.preventDefault();
      if (tags.length >= maxTags || tags.includes(inputValue.trim())) return;
      onChange?.([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    onChange?.(tags.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* Input 창처럼 보이는 wrapper */}
      <div className="w-full px-4 py-3 border border-grayScale-200 rounded-xl focus-within:outline-none flex flex-wrap items-center gap-2">
        {tags.map((tag, index) => (
          <div key={index} className="flex items-center gap-1 px-2 py-1 bg-key-100 text-white rounded-md">
            <span className="text-body2-medium"># {tag}</span>
            <button type="button" onClick={() => removeTag(index)} className="text-white hover:opacity-80 font-bold text-lg leading-none">×</button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder={tags.length === 0 ? placeholder : ''}
          disabled={tags.length >= maxTags}
          className="flex-1 outline-none border-none text-body1 placeholder:text-grayScale-300 disabled:bg-transparent min-w-[120px]"
        />
      </div>
      <p className="text-body3-regular text-grayScale-600 mt-2">
        {tags.length > 0 && `(${tags.length}/${maxTags})`}
      </p>
    </div>
  );
};

// 이미지 업로드
const ImageInput: React.FC<MatchingInputProps> = ({ images = [], onChange, maxImages = 3 }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalImages = [...images, ...newFiles].slice(0, maxImages);
      onChange?.(totalImages);
    }
  };

  const removeImage = (index: number) => {
    onChange?.(images.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-body3-sb text-grayScale-400 ">사진추가</p>
      <div className="flex gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative w-32 h-32">
            <Image src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} fill className="object-cover rounded-lg" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-grayScale-900 text-white rounded-full flex items-center justify-center hover:bg-grayScale-800"
            >
              ×
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="w-43 h-43 border-1  border-grayScale-200 rounded-lg flex flex-col items-center justify-center cursor-pointer gap-5 ">
            <div className="w-12 h-12 bg-primary-100 rounded-full border border-key-200 flex items-center justify-center">
              <Image src={plus} alt="사진 추가 아이콘" width={14} height={14} />
            </div>
            <span className="text-body1 text-grayScale-500">사진 업로드 하기</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" multiple={maxImages > 1} />
          </label>
        )}
      </div>
      <p className="text-caption1-regular text-grayScale-600 mt-2">최대 3장 업로드 가능</p>
    </div>
  );
};

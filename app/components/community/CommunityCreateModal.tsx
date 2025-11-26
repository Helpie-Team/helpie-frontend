"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCreateCommunityPostMutation } from "@/app/hooks/community/useCommunity";
import type { CommunityPostCategory } from "@/app/api/types/community/community";
import type { StaticImageData } from "next/image";
import {
  ChevronDown,
  Image as ImageIcon,
  X
} from "lucide-react";
import freeIcon from "@/public/icons/freeIcon.png"
import infoIcon from "@/public/icons/InfoIcon.png"

interface CommunityCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const MAX_IMAGES = 4;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

interface CategoryOption {
  value: CommunityPostCategory;
  label: string;
  icon:  StaticImageData;
}

export function CommunityCreateModal({
  isOpen,
  onClose,
  onSuccess,
}: CommunityCreateModalProps) {
  const [category, setCategory] = useState<CommunityPostCategory | "">("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { mutate: createPost, isPending: loading } =
    useCreateCommunityPostMutation();

  const categoryOptions: CategoryOption[] = [
    { value: "INFO_SHARE", label: "정보공유", icon: infoIcon },
    { value: "FREE_BOARD", label: "자유게시판", icon: freeIcon },
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !title.trim() || !content.trim()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    createPost(
      {
        category,
        title: title.trim(),
        content: content.trim(),
        images,
      },
      {
        onSuccess: () => {
          setCategory("");
          setTitle("");
          setContent("");
          setImages([]);
          setCurrentImageIndex(0);
          onSuccess?.();
          onClose();
        },
        onError: (error) => {
          console.error("게시글 작성 실패:", error);
          alert("게시글 작성에 실패했습니다. 다시 시도해주세요.");
        },
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const valid: File[] = [];
    const invalid: File[] = [];

    files.forEach((file) => {
      if (ALLOWED_TYPES.includes(file.type)) {
        valid.push(file);
      } else {
        invalid.push(file);
      }
    });

    if (invalid.length > 0) {
      alert("JPG, PNG 형식의 파일만 업로드할 수 있습니다.");
    }

    if (images.length + valid.length > MAX_IMAGES) {
      alert(`이미지는 최대 ${MAX_IMAGES}장까지 첨부할 수 있습니다.`);
      return;
    }

    const updated = [...images, ...valid];
    setImages(updated);
    if (images.length === 0) setCurrentImageIndex(0);
  };

  const removeImage = (index: number) => {
    const remaining = images.filter((_, i) => i !== index);
    setImages(remaining);

    if (remaining.length === 0) {
      setCurrentImageIndex(0);
      return;
    }

    if (index === currentImageIndex) {
      setCurrentImageIndex((prev) =>
        prev >= remaining.length ? remaining.length - 1 : prev
      );
    }
  };

  const showPrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const showNext = () => {
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="flex h-[590px] w-[540px] p-6 gap-6 flex-col overflow-hidden rounded-[30px] bg-white">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-h2-sb  text-black">포스트</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-black h-8 w-8 items-center justify-center"
          >
              <X className="h-6 w-6"/>
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4"
        >
          {/* 카테고리 선택 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex h-12 w-full items-center justify-between rounded-lg border border-grayScale-200 p-3 text-left"
            >
              <span className={category ? "text-black" : "text-gray-300"}>
                {category
                  ? categoryOptions.find((opt) => opt.value === category)
                      ?.label
                  : "커뮤니티 메뉴 선택"}
              </span>
              <ChevronDown className="h-6 w-6" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                {categoryOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setCategory(opt.value);
                      setIsDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-gray-50"
                  >
                    <Image
                        src={opt.icon}
                        alt={`${opt.label} 아이콘`}
                        width={16}
                        height={16}
                      />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 타이틀 */}
          <div className="border-b border-gray-100">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="타이틀을 작성해주세요."
              maxLength={20}
              className="h-12 w-full border-none px-0 text-sm text-black placeholder-gray-400 text-h3
                         focus:outline-none focus:ring-0"
            />
          </div>

          {/* 내용 */}
          <div className="border-b border-gray-100">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="나누고 싶은 이야기를 들려주세요!"
              rows={5}
              maxLength={1000}
              className="w-full h-[309px]  border-none text-h3 text-black resize-none
                         placeholder-gray-400 focus:outline-none focus:ring-0"
            />
          </div>

          {/* 이미지 미리보기 */}
          {images.length > 0 && (
            <div className="mt-4">
              <div className="relative w-full overflow-hidden rounded-lg">
                <Image
                  src={URL.createObjectURL(images[currentImageIndex])}
                  alt="첨부 이미지 미리보기"
                  width={800}
                  height={600}
                  className="max-h-[320px] w-full rounded-lg object-cover"
                  unoptimized
                />

                {/* 좌우 화살표 */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={showPrev}
                      className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={showNext}
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white"
                    >
                      ›
                    </button>
                  </>
                )}

                {/* 삭제 버튼 */}
                <button
                  type="button"
                  onClick={() => removeImage(currentImageIndex)}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* 하단 버튼들 */}
          <div className="flex items-center justify-between pt-2">
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png"
                onChange={handleImageChange}
                disabled={images.length >= MAX_IMAGES}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <button
                type="button"
                disabled={images.length >= MAX_IMAGES}
                className="flex h-10 w-10 items-center justify-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:text-gray-300"
              >
                <ImageIcon className="h-5 w-5" />
              </button>
            </div>

            <button
              type="submit"
              disabled={
                loading || !category || !title.trim() || !content.trim()
              }
              className="rounded-full bg-key-100 px-6 py-2 text-grayScale-400 transition-colors hover:bg-key-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              {loading ? "포스트하는 중..." : "포스트하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

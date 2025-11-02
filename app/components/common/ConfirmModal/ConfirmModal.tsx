'use client';

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[55]">
      <div className="bg-white rounded-[20px] p-6 w-full max-w-sm mx-4">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-black mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-medium text-base bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl font-medium text-base bg-black text-white hover:bg-gray-800 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}


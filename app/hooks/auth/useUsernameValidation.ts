import { useState, useCallback, useRef } from 'react';
import { useCheckUsername } from './useCheckUsername';

/**
 * 별명 실시간 중복 검증 훅 (Debounce 적용)
 */
export function useUsernameValidation(debounceMs: number = 100) {
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { checkUsernameAsync } = useCheckUsername();

  const validateUsername = useCallback(
    async (username: string): Promise<{ isValid: boolean; errorMessage: string | null }> => {
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (!username || username.length < 2) {
        setErrorMessage(null);
        setIsChecking(false);
        return { isValid: false, errorMessage: null };
      }

      return new Promise((resolve) => {
        timeoutRef.current = setTimeout(async () => {
          setIsChecking(true);
          setIsValidating(true);
          setErrorMessage(null);

          try {
            const result = await checkUsernameAsync({ username });
            
            
            if (result.result) {
              setErrorMessage(null);
              resolve({ isValid: true, errorMessage: null });
            } else {
              const message = result.message || '이미 사용 중인 별명입니다.';
              setErrorMessage(message);
              resolve({ isValid: false, errorMessage: message });
            }
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : '별명 확인 중 오류가 발생했습니다.';
            setErrorMessage(errorMsg);
            resolve({ isValid: false, errorMessage: errorMsg });
          } finally {
            setIsChecking(false);
            setIsValidating(false);
          }
        }, debounceMs);
      });
    },
    [checkUsernameAsync, debounceMs]
  );

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  return {
    validateUsername,
    isChecking,
    errorMessage,
    isValidating,
    clearError,
  };
}

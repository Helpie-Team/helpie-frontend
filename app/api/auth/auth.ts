import { SocialAuthRequest, SocialSignupRequest, AuthResult, UserInfoResponse } from '../types/auth/auth';
import { ApiError, AxiosErrorResponse } from '../types/axios';
import apiClient from '../axios/instance';
import { clearTokens } from '../../lib/utils/token';

/**
 * 소셜 로그인 (Google, Kakao)
 * @param: request - SocialAuthRequest
 * @returns: AuthResult
 * @returns: {
 *   success: boolean;
 *   data: SocialAuthResponse;
 *   message: string;
 *   error: string;
 * }
 */
export async function socialLogin(request: SocialAuthRequest): Promise<AuthResult> {
  try {
    const response = await apiClient.post(`/auth/social-login/${request.socialType}/signin`, {
      code: request.code,
      redirectUri: request.redirectUri,
    });
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    
    
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      
      if (axiosError.response) {
        
        const errorData = axiosError.response.data;
        
        
        if (errorData.data?.socialAccessToken) {
          return {
            success: true,
            data: {
              code: errorData.code,
              data: {
                socialAccessToken: errorData.data.socialAccessToken,
                socialType: errorData.data.socialType,
                profile: errorData.data.profile,
              },
              fieldErrors: null,
              message: errorData.message,
              timestamp: new Date().toISOString(),
            }
          }
        }
        
        return {
          success: false,
          message: errorData.message || '로그인에 실패했습니다.',
          error: errorData.error || `HTTP ${axiosError.response.status}`,
        };
      } else if (axiosError.request) {
        return {
          success: false,
          message: '서버에 연결할 수 없습니다.',
          error: 'Network Error',
        };
      } else {
        return {
          success: false,
          message: '요청 처리 중 오류가 발생했습니다.',
          error: axiosError.message,
        };
      }
    }
    
    return {
      success: false,
      message: '알 수 없는 오류가 발생했습니다.',
      error: 'Unknown error',
    };
  }
}

/**
 * 소셜 회원가입 (Google, Kakao)
 * @param: request - SocialSignupRequest
 * @returns: AuthResult
 * @returns: {
 *   success: boolean;
 *   data: SocialSignupResponse;
 *   message: string;
 *   error: string;
 * }
 */
export async function socialSignup(request: SocialSignupRequest): Promise<AuthResult> {
  try {
    const response = await apiClient.post(`/auth/social-login/${request.socialType}/signup`, {
      socialAccessToken: request.socialAccessToken,
      email: request.email,
      username: request.username,
    });
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    
    
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      
      if (axiosError.response) {
        const errorData = axiosError.response.data;
        return {
          success: false,
          message: errorData.message || '회원가입에 실패했습니다.',
          error: errorData.error || `HTTP ${axiosError.response.status}`,
        };
      } else if (axiosError.request) {
        return {
          success: false,
          message: '서버에 연결할 수 없습니다.',
          error: 'Network Error',
        };
      } else {
        return {
          success: false,
          message: '회원가입 요청 처리 중 오류가 발생했습니다.',
          error: axiosError.message,
        };
      }
    }
    
    return {
      success: false,
      message: '알 수 없는 오류가 발생했습니다.',
      error: 'Unknown error',
    };
  }
}



/**
 * 로그아웃
 * @returns: void
 */
export async function logout(refreshToken: string): Promise<void> {
  try {
    await apiClient.post('/auth/signout', {
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error('로그아웃 오류:', error);
  } finally {
    clearTokens();
  }
}


/**
 * 토큰 갱신
 * @returns: AuthResult
 * @returns: {
 *   success: boolean;
 *   data: RefreshTokenResponse;
 *   message: string;
 *   error: string;
 * }
 */
export async function refreshToken(): Promise<AuthResult> {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return {
        success: false,
        message: '리프레시 토큰이 없습니다.',
      };
    }

    const response = await apiClient.post('/auth/refresh', { refreshToken });
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    
    
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      
      if (axiosError.response) {
        const errorData = axiosError.response.data;
        return {
          success: false,
          message: errorData.message || '토큰 갱신에 실패했습니다.',
          error: errorData.error || `HTTP ${axiosError.response.status}`,
        };
      } else if (axiosError.request) {
        return {
          success: false,
          message: '서버에 연결할 수 없습니다.',
          error: 'Network Error',
        };
      } else {
        return {
          success: false,
          message: '토큰 갱신 요청 처리 중 오류가 발생했습니다.',
          error: axiosError.message,
        };
      }
    }
    
    return {
      success: false,
      message: '알 수 없는 오류가 발생했습니다.',
      error: 'Unknown error',
    };
  }
}


/**
 * 별명 중복 체크
 * @param: username - string
 * @returns: boolean
 * @returns: {
 *   success: boolean;
 *   data: {
 *     available: boolean;
 *     message: string;
 *   };
 *   message: string;
 *   error: string;
 * }
 */
export async function checkUsername(username: string): Promise<boolean> {
  try {
    const response = await apiClient.get('/auth/username-check', { 
      params: { username } 
    });
    
    return !response.data.result;
  } catch (err) {
    console.error('별명 중복 체크 오류:', err);
    return false;
  }
}

/**
 * 이메일 인증번호 검증
 * @param: email - string
 * @param: authNumber - number (인증번호)
 * @returns: AuthResult
 */
export async function verifyEmailCode(email: string, authNumber: number): Promise<AuthResult> {
  try {
    const response = await apiClient.get('/auth/mail-check', {
      params: {
        mail: email,
        authNumber: authNumber,
      }
    });
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      
      if (axiosError.response) {
        const errorData = axiosError.response.data;
        if (axiosError.response.status === 401) {
          return {
            success: false,
            message: errorData.message || '유효하지 않은 인증번호입니다.',
            error: errorData.code || 'EMAIL_001',
          };
        }
        
        return {
          success: false,
          message: errorData.message || '인증번호 검증에 실패했습니다.',
          error: errorData.error || `HTTP ${axiosError.response.status}`,
        };
      } else if (axiosError.request) {
        return {
          success: false,
          message: '서버에 연결할 수 없습니다.',
          error: 'Network Error',
        };
      } else {
        return {
          success: false,
          message: '요청 처리 중 오류가 발생했습니다.',
          error: axiosError.message,
        };
      }
    }
    
    return {
      success: false,
      message: '알 수 없는 오류가 발생했습니다.',
      error: 'Unknown error',
    };
  }
}

/**
 * 이메일 로그인
 * @param: email - string
 * @param: password - string
 * @returns: AuthResult
 */
export async function emailLogin(email: string, password: string): Promise<AuthResult> {
  try {
    const response = await apiClient.post('/auth/signin', { 
      email,
      password,
    });
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      
      if (axiosError.response) {
        const errorData = axiosError.response.data;
        
        return {
          success: false,
          message: errorData.message || '로그인에 실패했습니다.',
          error: errorData.error || `HTTP ${axiosError.response.status}`,
        };
      } else if (axiosError.request) {
        return {
          success: false,
          message: '서버에 연결할 수 없습니다.',
          error: 'Network Error',
        };
      } else {
        return {
          success: false,
          message: '요청 처리 중 오류가 발생했습니다.',
          error: axiosError.message,
        };
      }
    }
    
    return {
      success: false,
      message: '알 수 없는 오류가 발생했습니다.',
      error: 'Unknown error',
    };
  }
}

/**
 * 이메일 회원가입
 * @param: email - string
 * @param: username - string
 * @param: password - string
 * @returns: AuthResult
 */
export async function emailSignup(email: string, username: string, password: string): Promise<AuthResult> {
  try {
    const response = await apiClient.post('/auth/signup', {
      email,
      username,
      password,
    });
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      
      if (axiosError.response) {
        const errorData = axiosError.response.data;
        
        return {
          success: false,
          message: errorData.message || '회원가입에 실패했습니다.',
          error: errorData.error || `HTTP ${axiosError.response.status}`,
        };
      } else if (axiosError.request) {
        return {
          success: false,
          message: '서버에 연결할 수 없습니다.',
          error: 'Network Error',
        };
      } else {
        return {
          success: false,
          message: '회원가입 요청 처리 중 오류가 발생했습니다.',
          error: axiosError.message,
        };
      }
    }
    
    return {
      success: false,
      message: '알 수 없는 오류가 발생했습니다.',
      error: 'Unknown error',
    };
  }
}

/**
 * 이메일 인증번호 전송
 * @param: email - string
 * @returns: AuthResult
 * @returns: {
 *   success: boolean;
 *   data: { statusCode: number; message: string; result: string };
 *   message: string;
 *   error: string;
 * }
 */
export async function sendEmailVerificationCode(email: string): Promise<AuthResult> {
  try {
    const response = await apiClient.post('/auth/mail', {}, {
      params: { mail: email }
    });
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      
      if (axiosError.response) {
        const errorData = axiosError.response.data;
        if (axiosError.response.status === 409) {
          return {
            success: false,
            message: errorData.message || '이미 사용중인 이메일입니다.',
            error: errorData.code || 'USER_002',
          };
        }
        
        return {
          success: false,
          message: errorData.message || '인증번호 전송에 실패했습니다.',
          error: errorData.error || `HTTP ${axiosError.response.status}`,
        };
      } else if (axiosError.request) {
        return {
          success: false,
          message: '서버에 연결할 수 없습니다.',
          error: 'Network Error',
        };
      } else {
        return {
          success: false,
          message: '요청 처리 중 오류가 발생했습니다.',
          error: axiosError.message,
        };
      }
    }
    
    return {
      success: false,
      message: '알 수 없는 오류가 발생했습니다.',
      error: 'Unknown error',
    };
  }
}

/**
 * 사용자 정보 조회 (액세스 토큰 필요)
 * @returns: AuthResult<UserInfoResponse>
 * @returns: {
 *   success: boolean;
 *   data: UserInfoResponse;
 *   message: string;
 *   error: string;
 * }
 */
export async function getUserInfo(): Promise<AuthResult> {
  try {
    const response = await apiClient.get<UserInfoResponse>('/auth/authorization-guide');
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      
      if (axiosError.response) {
        const errorData = axiosError.response.data;
        return {
          success: false,
          message: errorData.message || '사용자 정보 조회에 실패했습니다.',
          error: errorData.error || `HTTP ${axiosError.response.status}`,
        };
      } else if (axiosError.request) {
        return {
          success: false,
          message: '서버에 연결할 수 없습니다.',
          error: 'Network Error',
        };
      } else {
        return {
          success: false,
          message: '요청 처리 중 오류가 발생했습니다.',
          error: axiosError.message,
        };
      }
    }
    
    return {
      success: false,
      message: '알 수 없는 오류가 발생했습니다.',
      error: 'Unknown error',
    };
  }
}

import apiClient from '../../axios/instance';
import {
  CreateReviewRequest,
  CreateReviewResponse,
} from '../../types/review/review';
import { ApiError, AxiosErrorResponse } from '../../types/axios';

/**
 * Create a review for a group
 * @param groupId - Group ID
 * @param reviewData - Review data (anonymityYn, rate, description)
 * @param images - Review image files array
 * @returns CreateReviewResponse
 */
export async function createReview(
  groupId: number,
  reviewData: CreateReviewRequest,
  images?: File[]
): Promise<CreateReviewResponse> {
  try {
    const formData = new FormData();

    const blob = new Blob([JSON.stringify(reviewData)], {
      type: 'application/json',
    });
    formData.append('payload', blob);

    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await apiClient.post<CreateReviewResponse>(
      `/review/create/${groupId}`,
      formData
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as ApiError<AxiosErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
}

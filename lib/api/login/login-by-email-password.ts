import { customerInstance } from "@/lib/axios/axios-instance";
import axios from "axios";

interface LoginResponse {
  success: boolean;
}

export const loginByUsernamePassword = async (username: string, password: string): Promise<{
  statusCode: number,
  data?: {
    success?: boolean;
    message: string;
  }
}> => {
  try {
    const response = await customerInstance.post<LoginResponse>('/api/login', {
      username,
      password,
    })


    return {
      statusCode: response.status,
      data: {
        ...response.data,
        message: 'Login successful',
      },
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        statusCode: error.response?.status || 500,
        data: {
          ...error.response?.data,
          message: error.response?.data?.message || 'Login failed',
        },
      };
    }

    return {
      statusCode: 500,
      data: {
        message: 'Login failed',
      },
    };
  }
}
import { customerInstance } from "@/lib/axios/axios-instance";
import axios from "axios";
import { CustomerResponseInterface } from "./customer.interface";

export const getCustomerById = async (id: number): Promise<{
  statusCode: number,
  data?: CustomerResponseInterface
}> => {

  try {
    const response = await customerInstance.get<CustomerResponseInterface>(`/api/customers/${id}`)
    return {
      statusCode: response.status,
      data: response.data,
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        statusCode: error.response?.status || 500,
      };
    }

    return {
      statusCode: 500,
    };
  }
}
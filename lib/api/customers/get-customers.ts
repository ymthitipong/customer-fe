import { customerInstance } from "@/lib/axios/axios-instance";
import axios from "axios";
import { CustomerListResponseInterface } from "./customer.interface";

interface CustomerSearchOptions {
  name?: string;
  company?: string;
  salesperson?: string;
}
type CustomerOrderBy = 'name' | 'total_spend' | 'number_of_purchases' | 'status' | 'last_activity';
type CustomerOrderDirection = 'asc' | 'desc';
interface CustomerOptions {
  order: {
    by: CustomerOrderBy;
    direction: CustomerOrderDirection;
  },
  limit: number;
  page: number;
}

export const getCustomers = async (searchOptions: CustomerSearchOptions, options?: CustomerOptions): Promise<{
  statusCode: number,
  data?: CustomerListResponseInterface
}> => {
  const limit = String(options?.limit ?? 20);
  const page = String(options?.page ?? 1);
  const orderBy = options?.order.by ?? 'name';
  const orderDirection = options?.order.direction ?? 'asc';

  try {
    const response = await customerInstance.get<CustomerListResponseInterface>('/api/customers', {
      params: {
        ...searchOptions,
        limit,
        page,
        order: `${orderBy}_${orderDirection}`,
      },
    })

    console.log('response', response)


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
import type { LoginFormInputs } from "@/types";

import { AuthEndPoint } from "@/shared/constant/endpoint";

import api from "../../../services/axiosConfig";

export const registerApi = async (data: LoginFormInputs): Promise<any> => {
  const response = await api.post(AuthEndPoint.REGISTER, {
    password: data.password,
    email: data.email,
  });
  return response.data.result;
};

export const loginApi = async (data: LoginFormInputs): Promise<any> => {
  const response = await api.post(AuthEndPoint.LOGIN, {
    password: data.password,
    email: data.email,
  });
  return response.data.result;
};

export const logoutApi = async ({
  userId,
  refreshToken,
}: {
  userId: string;
  refreshToken: string;
}): Promise<any> => {
  const response = await api.post(AuthEndPoint.LOGOUT, { userId });
  return response.data.result;
};

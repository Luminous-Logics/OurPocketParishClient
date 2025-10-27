"use server"
import { API_ENDPOINTS } from "@/config/api";
import { httpPost } from "@/lib/api/server";
import { CreateParishionerRequestBody, ParishionerResponse } from "@/types";
import { handleErrors } from "@/utils/apiHelpers";

export async function createParishioner(parishionerData: CreateParishionerRequestBody) {
  try {
    const url = API_ENDPOINTS.PARISHIONERS.CREATE;
    const response = await httpPost<ParishionerResponse>(url, parishionerData);
    return response.data;
  } catch (err) {
    throw handleErrors(err);
  }
}

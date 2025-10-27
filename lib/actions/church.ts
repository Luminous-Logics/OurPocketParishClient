"use server"
import { CreateChurchRequestBody } from "@/components/ChurchManagment/Schema";
import { API_ENDPOINTS } from "@/config/api";
import { httpPost } from "@/lib/api/server";
import {   ParishRes } from "@/types";
import { handleErrors } from "@/utils/apiHelpers";

export async function createParish(parishData: CreateChurchRequestBody) {
  try {
    const url = API_ENDPOINTS.PARISH.LIST;
    const response = await httpPost<ParishRes>(url, parishData);
    return response.data;
  } catch (err) {
    throw handleErrors(err);
  }
}

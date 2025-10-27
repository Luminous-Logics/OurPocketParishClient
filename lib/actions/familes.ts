"use server"
import { API_ENDPOINTS } from "@/config/api";
import { httpPost } from "@/lib/api/server";
import { Family } from "@/types";
import { handleErrors } from "@/utils/apiHelpers";

export async function createFamily(familyData: Omit<Family, "family_id" | "is_active" | "created_at" | "updated_at">) {
  try {
    const url = API_ENDPOINTS.FAMILIES.CREATE;
    const response = await httpPost<Family>(url, familyData);
    return response.data;
  } catch (err) {
    throw handleErrors(err);
  }
}

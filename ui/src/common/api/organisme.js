import { _get } from "../httpClient";

export const getOrganisme = async (id) => {
  return await _get(`/api/v1/entity/etablissement/${encodeURIComponent(id)}`, false);
};

export interface seasonType {
  season_id: number;
  season_name: string;
}

export interface ProductGroupType {
  id: string;
  prod_group: number;
  code: string;
  name_th: string;
  name_en: string;
  tare_weight_min: number;
  tare_weight_max: number;
  pack_unit_id: string;
  per_unit: number;
}

export interface CustomerType {
  id: string;
  no: string;
  code: string;
  name_th: string;
  name_en: string;
  tel: string;
  party_type: string;
}

export interface CustomerAddressType {
  id: string;
  cus_id: string;
  code: string;
  address_no: string;
  address_th: string;
  address_en: string;
  address_default: number;
  address_1: string;
  address_2: string;
  province: string;
  amphur: string;
  district: string;
  zipcode: string;

}
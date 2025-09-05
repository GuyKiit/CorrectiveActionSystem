// src/context/DataContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { _POST } from "../../service/mas";
import { CustomerAddressType, CustomerType, ProductGroupType, seasonType } from "../../types/data";


interface DataContextType {
  seasons: seasonType[] | null;
  ProductGroup: ProductGroupType[] | null;
  Customer: CustomerType[] | null;
  CustomerAddress: CustomerAddressType[] | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [seasons, setSeasons] = useState<seasonType[] | null>(null);
  const [ProductGroup, setProductGroup] = useState<ProductGroupType[] | null>(null);
  const [Customer, setCustomer] = useState<CustomerType[] | null>(null);
  const [CustomerAddress, setCustomerAddress] = useState<CustomerAddressType[] | null>(null);

  // const fetchSeasons = async () => {
  //   try {
  //     const response = await _GET_SCSS({}, "/Season/Season_Get");
  //     if (Array.isArray(response)) {
  //       setSeasons(response);
  //     } else {
  //       setSeasons([]);
  //     }
  //   } catch (err) {
  //     console.error("Failed to fetch seasons", err);
  //     setSeasons([]);
  //   }
  // };

  // const Product_Group_Get = async () => {
  //   try {
  //     const dataset = {

  //     }
  //     const response = await _POST(dataset, "/Product/ProductGet");

  //     if (response && response.status === "success") {
  //       const filtered = response.data.filter(
  //         (item: any) => item.prod_group == null
  //       );
  //       setProductGroup(filtered);
  //     }else{
  //       setProductGroup([]);
  //     }
  //   } catch (e) {
  //     console.log("error:", e);
  //   }
  // };
  // const Customer_Get = async () => {
  //   try {
  //     const dataset = {

  //     }
  //     const response = await _POST(dataset, "/Customer/CustomerGet");

  //     if (response && response.status === "success") {
  //       const filtered = response.data.filter(
  //         (item: any) => item.prod_group == null
  //       );
  //       setCustomer(filtered);
  //     }else{
  //       setCustomer([]);
  //     }
  //   } catch (e) {
  //     console.log("error:", e);
  //   }
  // };

  // const Customer_Address_Get = async () => {
  //   try {
  //     const dataset = {

  //     }
  //     const response = await _POST(dataset, "/Customer/CustomerAddressGet");

  //     if (response && response.status === "success") {
  //       const filtered = response.data.filter(
  //         (item: any) => item.prod_group == null
  //       );
  //       setCustomerAddress(filtered);
  //     }else{
  //       setCustomerAddress([]);
  //     }
  //   } catch (e) {
  //     console.log("error:", e);
  //   }
  // };

  useEffect(() => {
    // fetchSeasons();
    // Product_Group_Get();
    // Customer_Get();
    // Customer_Address_Get();
  }, []);

  return (
    <DataContext.Provider value={{
      seasons,
      ProductGroup,
      Customer,
      CustomerAddress,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

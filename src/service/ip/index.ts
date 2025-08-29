import axios from "axios";

export const fetchIpAddress = async () => {
    try {
      const response = await axios.get("https://ipinfo.io/ip");
      return response.data;
    } catch (error) {
      return "";
    }
  };
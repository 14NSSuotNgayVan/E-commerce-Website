// useDataFetching.js
import { useState, useEffect } from "react";
import { OptionReactSelect } from "../models/models";

const useDataFetching = (handleFetching: any, params?:any) => {
  const [data, setData] = useState<OptionReactSelect[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await handleFetching(params);
      response && setData(response.data.data.content);
    };
    fetchData();
  }, [handleFetching, params]);

  return data;
};

export default useDataFetching;

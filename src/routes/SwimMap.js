import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import NaverMap from "../components/naverMap/NaverMap";
import useGeolocation from "../hooks/useGeolocation";
import useSwimData from "../hooks/useSwimData";

const SwimMap = () => {
  // reducer에서 map 객체 저장하고 한번 더 부름
  const map = useSelector((state) => state.swimMap.map);

  const { getGeolocation } = useGeolocation();
  const { getSwimDataGeolocation } = useSwimData();

  useEffect(() => {
    if (map !== null) {
      getGeolocation();
      getSwimDataGeolocation();
    }
  }, [map]);

  return <NaverMap />;
};

export default SwimMap;

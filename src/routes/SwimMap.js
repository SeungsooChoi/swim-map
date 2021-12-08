import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import NaverMap from "../components/naverMap/NaverMap";
import useGeolocation from "../hooks/useGeolocation";
import useSetMarker from "../hooks/useSetMarker";
import useSwimData from "../hooks/useSwimData";

const SwimMap = () => {
  const map = useSelector((state) => state.swimMap.map);
  const poolList = useSelector((state) => state.swimMap.poolList);

  const { getGeolocation } = useGeolocation();
  const { getSwimDataGeolocation } = useSwimData();
  const { setMarker } = useSetMarker();

  useEffect(() => {
    if (map !== null) {
      getGeolocation();
      getSwimDataGeolocation();
    }
  }, [map]);

  useEffect(() => {
    setMarker();
  }, [poolList]);

  return <NaverMap />;
};

export default SwimMap;

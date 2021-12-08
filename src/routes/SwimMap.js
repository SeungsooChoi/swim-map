import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import NaverMap from "../components/naverMap/NaverMap";
import useGeolocation from "../hooks/useGeolocation";
import useSetMarker from "../hooks/useSetMarker";
import useSwimData from "../hooks/useSwimData";
import styled from "styled-components";

const SwimMap = () => {
  const map = useSelector((state) => state.swimMap.map);
  const poolPositionList = useSelector(
    (state) => state.swimMap.poolPositionList
  );

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
  }, [poolPositionList]);

  return (
    <>
      {/* <PoolList /> */}
      <NaverMap />
    </>
  );
};

const Container = styled.div`
  display: flex;
`;
export default SwimMap;

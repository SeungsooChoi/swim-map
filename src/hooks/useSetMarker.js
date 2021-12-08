import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../modules/mapReducer";

const { naver } = window;

let naverMap = {};

const useSetMarker = () => {
  const { map, poolList, marker } = useSelector((state) => ({
    map: state.swimMap.map,
    poolList: state.swimMap.poolList,
    marker: state.swimMap.marker,
  }));

  const dispatch = useDispatch();

  naverMap = map;

  const setMarker = () => {
    let newMarkerArr = [];

    if (poolList.length > 0) {
      poolList.map((pool) => {
        if (pool.length > 0) {
          const place = pool[0];
          let newMarker = new naver.maps.Marker({
            position: new naver.maps.LatLng(place.y, place.x),
            map: naverMap,
          });

          newMarkerArr.push(newMarker);
        }
      });
      dispatch(actionCreators.addMarker(newMarkerArr));
    }
  };

  return { setMarker };
};

export default useSetMarker;

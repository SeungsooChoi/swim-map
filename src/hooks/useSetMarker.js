import { useDispatch, useSelector } from "react-redux";
import { updateMarkers } from "../mapApi";
import { actionCreators } from "../modules/mapReducer";

const { naver } = window;

let naverMap = {};

const useSetMarker = () => {
  const { map, poolPositionList, poolList } = useSelector((state) => ({
    map: state.swimMap.map,
    poolPositionList: state.swimMap.poolPositionList,
    poolList: state.swimMap.poolList,
  }));

  const dispatch = useDispatch();

  naverMap = map;

  const setMarker = () => {
    let newMarkerArr = [];
    let newInfoWindowArr = [];

    if (poolPositionList.length > 0) {
      poolPositionList.map((pool, i) => {
        if (pool.length > 0) {
          const place = pool[0];
          let newMarker = new naver.maps.Marker({
            position: new naver.maps.LatLng(place.y, place.x),
            map: naverMap,
          });

          let infoWindow = new naver.maps.InfoWindow({
            content: `<div class="iw_inner">
                          <h1>${poolList[i].FACLT_NM}</h1>
                          <div>
                            ${
                              poolList[i].REGULR_RELYSWIMPL_LENG
                                ? `
                                <div>정규경영장 레인 길이 : ${poolList[i].REGULR_RELYSWIMPL_LENG}(M)</div>
                                <div>정규경영장 레인 수 : ${poolList[i].REGULR_RELYSWIMPL_LANE_CNT}(줄)</div>`
                                : poolList[i].IRREGULR_RELYSWIMPL_LENG
                                ? `
                                <div>비정규경영장 레인 길이 : ${poolList[i].IRREGULR_RELYSWIMPL_LENG}(M)</div>
                                <div>비정규경영장 레인 수 : ${poolList[i].IRREGULR_RELYSWIMPL_LANE_CNT}(줄)</div>`
                                : `제공되는 레인 길이, 레인 수가 없습니다.`
                            }
                          </div>
                        </div>`,
            borderWidth: 0,
            disableAnchor: true,
            backgroundColor: "transparent",
          });

          newMarkerArr.push(newMarker);
          newInfoWindowArr.push(infoWindow);
        }
      });
      dispatch(actionCreators.addMarker(newMarkerArr));

      naver.maps.Event.addListener(naverMap, "idle", () =>
        updateMarkers(naverMap, newMarkerArr)
      );

      for (let i = 0; i < newMarkerArr.length; i++) {
        naver.maps.Event.addListener(newMarkerArr[i], "click", function () {
          handleClickMarkers(i);
        });
      }
    }

    const handleClickMarkers = (seq) => {
      let marker = newMarkerArr[seq];
      let infoWindow = newInfoWindowArr[seq];
      if (infoWindow.getMap()) {
        infoWindow.close();
      } else {
        infoWindow.open(naverMap, marker);
      }
    };
  };

  return { setMarker };
};

export default useSetMarker;

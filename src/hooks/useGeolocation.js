import { useSelector } from "react-redux";

const { naver } = window;

var naverMap = {};

/**
 * 현재 위치 가져와서 지도 이동.
 * @returns getGeolocation
 */
const useGeolocation = () => {
  const map = useSelector((state) => state.swimMap.map);

  naverMap = map;

  const getLocation = async () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const getGeolocation = async () => {
    // 위치정보 사용 가능
    if ("geolocation" in navigator) {
      // 지도가 올라온경우
      if (naverMap !== null) {
        const { coords } = await getLocation();
        naverMap.panTo(
          new naver.maps.LatLng(coords.latitude, coords.longitude)
        );
      }
    } else {
      /* 위치정보 사용 불가능 */
      console.log("위치정보 사용 불가능");
    }
  };
  return { getGeolocation };
};

export default useGeolocation;

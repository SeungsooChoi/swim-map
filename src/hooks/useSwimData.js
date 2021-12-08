import axios from "axios";
import { useDispatch } from "react-redux";
import { actionCreators } from "../modules/mapReducer";

const useSwimData = () => {
  const dispatch = useDispatch();

  // 수영장 데이터 중 도로명, 지번 주소가 없는애들 제외하고 리턴.
  const filterSwimpool = (dataArr) =>
    dataArr.filter((data) => data.REFINE_LOTNO_ADDR || data.REFINE_ROADNM_ADDR);

  const getSwimmingPoolGeocode = (poolDataArr) => {
    console.log("수영장 데이터 geoCode 시작");

    const dataAddr = poolDataArr;

    axios
      .post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}`, dataAddr)
      .then((response) => {
        const { data } = response;
        console.log("수영장 데이터 geoCode 완료");

        dispatch(actionCreators.setPoolPositionList(data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSwimDataGeolocation = async () => {
    try {
      const {
        data: { PublicSwimmingPool },
      } = await axios.get(
        `${process.env.REACT_APP_SWIMMING_POOL_API_URL}?KEY=${process.env.REACT_APP_SWIMMING_POOL_API_KEY}&Type=json&pIndex=1&pSize=100`
      );

      const [resultType, code] =
        PublicSwimmingPool[0].head[1].RESULT.CODE.split("-");

      if (resultType === "INFO" && code === "000") {
        console.log("수영장 데이터 받아옴");
        // 수영장 데이터 중 도로명, 지번 주소가 없는애들 제외
        const filteredData = filterSwimpool(PublicSwimmingPool[1].row);
        dispatch(actionCreators.setPoolList(filteredData));
        // 수영장 주소 좌표변환
        getSwimmingPoolGeocode(filteredData);
      } else {
        new Error(resultType);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { getSwimDataGeolocation };
};

export default useSwimData;

import React, { useEffect, useState } from "react";
import dotenv from "dotenv";
import "./App.css";
import axios from "axios";
import styled from "styled-components";
import { updateMarkers } from "./mapApi";
dotenv.config();

// naver map api로 인해 전역 변수로 관리
let mapObj = null;
let markers = [],
  infoWindows = [];

const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
`;

function App() {
  const [location, setLocation] = useState({});
  const [swimpoolArr, setSwimpoolArr] = useState([]);
  const [swimpoolGeocodeArr, setSwimpoolGeocodeArr] = useState([]);

  const paintingMap = () => {
    mapObj = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(
        location.latitude,
        location.longitude
      ),
      zoomControl: true,
      zoomControlOptions: {
        style: window.naver.maps.ZoomControlStyle.SMALL,
        position: window.naver.maps.Position.TOP_RIGHT,
      },
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: window.naver.maps.MapTypeControlStyle.BUTTON,
        position: window.naver.maps.Position.TOP_RIGHT,
      },
      minZoom: 6,
      zoom: 10,
    });
  };

  const getGeolocation = async () => {
    console.log("위치정보 가져오는 중...");
    if ("geolocation" in navigator) {
      /* 위치정보 사용 가능 */
      const { coords } = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      console.log(coords);
      setLocation({ latitude: coords.latitude, longitude: coords.longitude });
    } else {
      /* 위치정보 사용 불가능 */
      console.log("위치정보 사용 불가능");
    }
  };

  const makeCurrentPositionMarker = () => {
    // 나온 주소에 맞게 이동하기
    mapObj.panTo(
      window.naver.maps.LatLng(location.latitude, location.longitude)
    );
    // 현재 위치에 마커 표시
    let currentMarker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(
        location.latitude,
        location.longitude
      ),
      map: mapObj,
      title: "myLocation",
      icon: {
        content: ['<div class="map__marker--me">', "🙋‍♂️", "</div>"].join(""),
        size: new window.naver.maps.Size(38, 58),
        anchor: new window.naver.maps.Point(19, 58),
      },
    });
  };

  const loadSwimmingPoolData = async () => {
    console.log("수영장 정보 가져오는 중..");

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

        // 수영장 데이터 중 도로명, 지번 주소가 없는애들 제외하고 state에 넣음.
        setSwimpoolArr(filterSwimpool(PublicSwimmingPool[1].row));
        // 수영장 주소 좌표변환용
        getSwimmingPoolGeocode(PublicSwimmingPool[1].row);
      } else {
        new Error(resultType);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 수영장 데이터 중 도로명, 지번 주소가 없는애들 제외하고 리턴.
  const filterSwimpool = (dataArr) =>
    dataArr.filter((data) => data.REFINE_LOTNO_ADDR || data.REFINE_ROADNM_ADDR);

  const getSwimmingPoolGeocode = (swimmingPoolDataArr) => {
    console.log("수영장 데이터 geoCode 시작");

    const dataAddr = swimmingPoolDataArr;

    axios
      .post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}`, dataAddr)
      .then((response) => {
        const { data } = response;
        console.log("수영장 데이터 geoCode 완료");

        setSwimpoolGeocodeArr(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const paintMarker = () => {
    if (swimpoolGeocodeArr.length > 0) {
      let data = swimpoolGeocodeArr;
      // 가져온 response에 대한 지도 마커
      console.log(swimpoolArr);
      console.log(data);
      data.forEach((data, i) => {
        if (data.length > 0) {
          const current = data[0];
          let marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(current.y, current.x),
            map: mapObj,
          });
          let infoWindow = new window.naver.maps.InfoWindow({
            content: `<div>
                        <h1>${swimpoolArr[i].FACLT_NM}</h1>
                        <div>
                          ${
                            swimpoolArr[i].REGULR_RELYSWIMPL_LENG
                              ? `
                              <span>정규경영장 레인 길이 : ${swimpoolArr[i].REGULR_RELYSWIMPL_LENG}(M)</span>
                              <span>정규경영장 레인 수 : ${swimpoolArr[i].REGULR_RELYSWIMPL_LANE_CNT}(줄)</span>`
                              : swimpoolArr[i].IRREGULR_RELYSWIMPL_LENG
                              ? `
                              <span>비정규경영장 레인 길이 : ${swimpoolArr[i].IRREGULR_RELYSWIMPL_LENG}(M)</span>
                              <span>비정규경영장 레인 수 : ${swimpoolArr[i].IRREGULR_RELYSWIMPL_LANE_CNT}(줄)</span>`
                              : `제공되는 레인 길이, 레인 수가 없습니다.`
                          }
                          
                        </div>
                      </div>`,
          });

          // 전역 마커 배열에 push
          markers.push(marker);
          infoWindows.push(infoWindow);
        }
      });
      window.naver.maps.Event.addListener(mapObj, "idle", () =>
        updateMarkers(mapObj, markers)
      );

      for (let i = 0; i < markers.length; i++) {
        window.naver.maps.Event.addListener(markers[i], "click", function () {
          handleClickMarkers(i);
        });
      }
    }
  };

  const handleClickMarkers = (seq) => {
    let marker = markers[seq];
    let infoWindow = infoWindows[seq];
    if (infoWindow.getMap()) {
      infoWindow.close();
    } else {
      infoWindow.open(mapObj, marker);
    }
  };

  useEffect(() => {
    // 내 위치 가져오기
    getGeolocation();

    // 지도 그리기
    paintingMap();

    // 수영장 데이터 가져오기
    loadSwimmingPoolData();
  }, []);

  // 위치 정보가 변경될 때 해당 주소로 화면 이동 및 마커 표시
  useEffect(() => {
    makeCurrentPositionMarker();
  }, [location]);

  // 수영장 좌표 변환을 마쳤으면 마커 및 정보 표시
  useEffect(() => {
    paintMarker();
  }, [swimpoolGeocodeArr]);

  return (
    <>
      <MapContainer id="map" className="map" />
    </>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import dotenv from "dotenv";
import "./Map.css";
import axios from "axios";
import styled from "styled-components";
dotenv.config();

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

let mapObj = null;

function Map() {
  const [location, setLocation] = useState({
    latitude: 37.3595704,
    longitude: 127.105399,
  });
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
      zoom: 15,
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

  const moveMapPoint = () => {
    // 나온 주소에 맞게 이동하기
    mapObj.panTo(
      window.naver.maps.LatLng(location.latitude, location.longitude)
    );

    // 현재 위치에 마커 표시
    const currentPosition = new window.naver.maps.Marker({
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
        data: { PublicSwimmingPool: poolData },
      } = await axios.get(
        `${process.env.REACT_APP_SWIMMING_POOL_API_URL}?KEY=${process.env.REACT_APP_SWIMMING_POOL_API_KEY}&Type=json&pIndex=1&pSize=100`
      );

      connectBackend(poolData);
    } catch (error) {
      console.log(error);
    }
  };

  const connectBackend = (poolData) => {
    const dataAddr = poolData[1].row;

    axios
      .post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}`, dataAddr)
      .then((response) => {
        const { data } = response;
        // 가져온 response에 대한 지도 마커
        data.forEach((data) => {
          if (data.length > 0) {
            const current = data[0];
            let marker = new window.naver.maps.Marker({
              position: new window.naver.maps.LatLng(current.y, current.x),
              map: mapObj,
            });
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    // 지도 그리기
    paintingMap();

    // 내 위치 가져오기
    getGeolocation();

    // 수영장 데이터 가져오기
    loadSwimmingPoolData();
  }, []);

  // 위치 정보가 변경될 때 해당 주소로 화면 이동 및 마커 표시
  useEffect(() => {
    moveMapPoint();
  }, [location]);

  return <Container id="map" className="map" />;
}

export default Map;

import React from "react";
import dotenv from "dotenv";
import "./Map.css";
import axios from "axios";
dotenv.config();

let map = null;

class Map extends React.Component {
  state = {
    latitude: 37.3595704,
    longitude: 127.105399,
  };

  getGeolocation = async () => {
    console.log("위치정보 가져오는 중...");
    if ("geolocation" in navigator) {
      /* 위치정보 사용 가능 */
      const { coords } = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      console.log(coords);
      this.setState({ latitude: coords.latitude, longitude: coords.longitude });

      // 나온 주소에 맞게 이동하기
      map.panTo(
        window.naver.maps.LatLng(this.state.latitude, this.state.longitude)
      );

      // 현재 위치에 마커 표시
      const currentPosition = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(
          this.state.latitude,
          this.state.longitude
        ),
        map: map,
      });
    } else {
      /* 위치정보 사용 불가능 */
      console.log("위치정보 사용 불가능");
    }
  };

  loadSwimmingPoolData = async () => {
    console.log("수영장 정보 가져오는 중..");

    await axios
      .get(
        `${process.env.REACT_APP_SWIMMING_POOL_API_URL}?KEY=${process.env.REACT_APP_SWIMMING_POOL_API_KEY}&Type=json&pIndex=1&pSize=100`
      )
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };
  paintingMap = () => {
    map = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(
        this.state.latitude,
        this.state.longitude
      ),
      zoom: 15,
    });
  };

  componentDidMount() {
    // 내 위치 가져오기
    this.getGeolocation();

    // 수영장 데이터 가져오기
    this.loadSwimmingPoolData();

    // 지도 그리기
    this.paintingMap();
  }

  render() {
    return (
      <div id="map" className="map">
        Swim-Map
      </div>
    );
  }
}

export default Map;

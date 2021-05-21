import React from "react";
import dotenv from "dotenv";
import "./Map.css";
import axios from "axios";
dotenv.config();

let map = null;

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 37.3595704,
      longitude: 127.105399,
      swimmingPoolArr: [],
      username: null,
    };
  }

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

  // getGeocode = (data) => {
  //   const row = data[1].row;
  //   const config = {
  //     headers: {
  //       "X-NCP-APIGW-API-KEY-ID": process.env.REACT_APP_NAVER_CLIENT_ID,
  //       "X-NCP-APIGW-API-KEY": process.env.REACT_APP_NAVRR_CLIENT_SECRET,
  //     },
  //   };

  //   row.forEach((element) => {
  //     console.log(element);
  //     // const geocode = axios.get(
  //     //   `${process.env.REACT_APP_NAVER_GEOCODE_URL}?query=${element.REFINE_ROADNM_ADDR}`,
  //     //   config
  //     // );

  //     // console.log(geocode);
  //   });
  // };

  connectBackend = async (poolData) => {
    const dataAddr = poolData[1].row;

    axios
      .post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}`, dataAddr)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  loadSwimmingPoolData = async () => {
    console.log("수영장 정보 가져오는 중..");

    try {
      const {
        data: { PublicSwimmingPool: poolData },
      } = await axios.get(
        `${process.env.REACT_APP_SWIMMING_POOL_API_URL}?KEY=${process.env.REACT_APP_SWIMMING_POOL_API_KEY}&Type=json&pIndex=1&pSize=100`
      );

      this.connectBackend(poolData);
    } catch (error) {
      console.log(error);
    }
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

  componentDidMount = () => {
    // 지도 그리기
    this.paintingMap();

    // 내 위치 가져오기
    this.getGeolocation();

    // 수영장 데이터 가져오기
    this.loadSwimmingPoolData();
  };

  render() {
    return (
      <div id="map" className="map">
        Swim-Map
      </div>
    );
  }
}

export default Map;

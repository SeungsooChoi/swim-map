import { Component } from "react";
import dotenv from "dotenv";
import "./Map.css";
import axios from "axios";
dotenv.config();

class Map extends Component {
  paintingMap = () => {
    console.log(process.env.REACT_APP_NAVER_CLIENT_ID);

    const map = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 10,
    });
  };

  loadSwimmingPoolData = async () => {
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
  componentDidMount() {
    // 지도 그리기
    this.paintingMap();

    // 수영장 데이터 가져오기
    this.loadSwimmingPoolData();
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

import { Component } from "react";
import dotenv from "dotenv";
dotenv.config();

class Map extends Component {
  componentDidMount() {
    console.log(process.env.REACT_APP_NAVER_CLIENT_ID);

    const map = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 10,
    });
  }

  render() {
    return <div id="map">Swim-Map</div>;
  }
}

export default Map;

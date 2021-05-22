const express = require("express");
const router = express.Router();
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
let addrList = [];

const getGeocode = async (address) => {
  try {
    const {
      data: { addresses },
    } = await axios.get(
      `${process.env.REACT_APP_NAVER_GEOCODE_URL}?query=${encodeURI(address)}`,
      {
        headers: {
          "X-NCP-APIGW-API-KEY-ID": process.env.REACT_APP_NAVER_CLIENT_ID,
          "X-NCP-APIGW-API-KEY": process.env.REACT_APP_NAVRR_CLIENT_SECRET,
        },
      }
    );
    return addresses;
  } catch (error) {
    console.log(error);
  }
};

const makeArr = async (data) => {
  // Naver Geocoding 적용할 부분만 고르기
  //   data.forEach(async (element, idx) => {
  //     if (idx == 0) {
  //       await getGeocode(element.REFINE_LOTNO_ADDR);
  //     }
  //     if (element.REFINE_LOTNO_ADDR !== null) {
  //       await getGeocode(element.REFINE_LOTNO_ADDR);
  //     } else if (element.REFINE_ROADNM_ADDR !== null) {
  //       await getGeocode(element.REFINE_ROADNM_ADDR);
  //     } else {
  //       console.log(`정보없음`);
  //     }
  //   });

  for (const item of data) {
    if (item.REFINE_LOTNO_ADDR !== null) {
      addrList.push(await getGeocode(item.REFINE_LOTNO_ADDR));
    } else if (item.REFINE_ROADNM_ADDR !== null) {
      addrList.push(await getGeocode(item.REFINE_ROADNM_ADDR));
    } else {
      console.log(`정보없음`);
    }
  }
  console.log(addrList);
};

router.post("/", (req, res) => {
  const { body } = req;

  makeArr(body);
});

module.exports = router;

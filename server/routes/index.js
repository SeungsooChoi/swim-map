const express = require("express");
const router = express.Router();
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

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

// Naver Geocode를 사용하여 주소로 좌표 변환
const makeArr = async (data) => {
  let addrList = [];

  for (const item of data) {
    if (item.REFINE_LOTNO_ADDR !== null) {
      addrList.push(await getGeocode(item.REFINE_LOTNO_ADDR));
    } else if (item.REFINE_ROADNM_ADDR !== null) {
      addrList.push(await getGeocode(item.REFINE_ROADNM_ADDR));
    } else {
    }
  }

  return addrList;
};

router.post("/", (req, res) => {
  const { body } = req;

  makeArr(body).then((addrList) => res.send(addrList));
});

module.exports = router;

/**
 * swimMap action type 정의
 */
const SET_MAP = "setMap";
const SET_POOL_LIST = "setPoolList";
const ADD_MARKER = "addMarker";

/**
 * setMap action 생성 함수
 */
const setMap = (map) => {
  return {
    type: SET_MAP,
    map,
  };
};

const setPoolList = (poolList) => {
  return {
    type: SET_POOL_LIST,
    poolList,
  };
};

const addMarker = (marker) => {
  return {
    type: ADD_MARKER,
    marker,
  };
};

const mapReducer = (
  state = {
    swimMap: {
      map: null,
      poolList: [],
      marker: [],
    },
  },
  action
) => {
  console.log(action);
  switch (action.type) {
    case SET_MAP:
      return {
        ...state,
        swimMap: {
          ...state.swimMap,
          map: action.map,
        },
      };
    case SET_POOL_LIST:
      return {
        ...state,
        swimMap: {
          ...state.swimMap,
          poolList: action.poolList,
        },
      };
    case ADD_MARKER:
      return {
        ...state,
        swimMap: {
          ...state.swimMap,
          marker: action.marker,
        },
      };
    default:
      return state;
  }
};

export const actionCreators = {
  setMap,
  setPoolList,
  addMarker,
};

export default mapReducer;

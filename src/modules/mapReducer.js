/**
 * swimMap action type 정의
 */
const SET_MAP = "setMap";
const SET_POOL_LIST = "setPoolList";

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

const mapReducer = (
  state = {
    swimMap: {
      map: null,
      poolList: [],
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
    default:
      return state;
  }
};

export const actionCreators = {
  setMap,
  setPoolList,
};

export default mapReducer;

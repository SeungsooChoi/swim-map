import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const { naver } = window;
let poolArr = [];

const PoolList = () => {
  const poolList = useSelector((state) => state.swimMap.poolList);

  poolArr = poolList;
  return (
    <Container>
      <h2>경기도 공공 수영장 목록입니다.</h2>
      {poolArr.length > 0 &&
        poolArr.map((pool, i) => (
          <Place key={i}>
            <Title>{pool.FACLT_NM}</Title>
            <Addr>
              {pool.REFINE_ROADNM_ADDR
                ? pool.REFINE_ROADNM_ADDR
                : pool.REFINE_LOTNO_ADDR}
            </Addr>
            <Info>
              {pool.REGULR_RELYSWIMPL_LENG && (
                <>
                  <div>
                    정규경영장 레인 길이 : {pool.REGULR_RELYSWIMPL_LENG}(M)
                  </div>
                  <div>
                    정규경영장 레인 수 :{" "}
                    {poolList[i].REGULR_RELYSWIMPL_LANE_CNT}(줄)
                  </div>
                </>
              )}
              {pool.IRREGULR_RELYSWIMPL_LENG && (
                <>
                  <div>
                    비정규경영장 레인 길이 : {pool.IRREGULR_RELYSWIMPL_LENG}(M)
                  </div>
                  <div>
                    비정규경영장 레인 수 : {pool.IRREGULR_RELYSWIMPL_LANE_CNT}
                    (줄)
                  </div>
                </>
              )}
              {!pool.REGULR_RELYSWIMPL_LENG &&
                !pool.IRREGULR_RELYSWIMPL_LENG && (
                  <div>제공되는 레인 길이, 레인 수가 없습니다.</div>
                )}
            </Info>
          </Place>
        ))}
    </Container>
  );
};

const Container = styled.div`
  width: 40%;
  overflow-y: scroll;
  h2 {
    padding: 1rem;
  }
`;

const Place = styled.div`
  padding: 1rem;
  box-sizing: border-box;
  & + & {
    border-top: 1px solid #dddddd;
    padding-top: 1rem;
  }
`;

const Title = styled.div``;

const Addr = styled.div``;

const Info = styled.span``;

export default PoolList;

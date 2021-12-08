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
      <h2>수영장목록입니다.</h2>
      {poolArr.length > 0 &&
        poolArr.map((pool, i) => (
          <div key={i}>
            <Title>{pool.FACLT_NM}</Title>
            <Addr>
              {pool.REFINE_ROADNM_ADDR
                ? pool.REFINE_ROADNM_ADDR
                : pool.REFINE_LOTNO_ADDR}
            </Addr>
            <Info></Info>
          </div>
        ))}
    </Container>
  );
};

const Container = styled.div`
  width: 40%;
  overflow-y: scroll;
`;

const Title = styled.div``;

const Addr = styled.div``;

const Info = styled.span``;

export default PoolList;

import { Button, Input, SimpleGrid, Text } from "@mantine/core";
import styled from "styled-components";
import { BiDollar } from "react-icons/bi";
import { MdOutlineWatchLater, MdOutlineInfo } from "react-icons/md";
import Image from "next/image";
import { IoIosArrowDown } from "react-icons/io";

const TitleText = styled(Text)`
  font-size: 26px;
  font-weight: bold;
`;

const Container = styled.div`
  margin: 30px auto;
  max-width: 1080px;
`;

const TypeWrapper = styled.div`
  display: flex;
  border: 1px solid rgb(229, 232, 235);
  border-radius: 10px;
`;

const TypeItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 108px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;

const PriceWrapper = styled.div`
  display: flex;
`;

const CInput = styled(Input)`
  && input {
    height: 52.8px;
  }
  margin-left: 25px;
`;

const Sell = () => {
  return (
    <Container>
      <SimpleGrid cols={2} style={{ gap: "200px" }}>
        <div>
          <TitleText>List item for sale</TitleText>
          <div style={{ display: "flex", justifyContent: "space-between", margin: "30px 0 10px 0" }}>
            <Text style={{ fontWeight: "bold" }}>Type</Text>
            <MdOutlineInfo style={{ fontSize: "26px" }} />
          </div>
          <TypeWrapper>
            <TypeItem style={{ borderRight: "1px solid rgb(229, 232, 235)", backgroundColor: "rgb(243, 251, 254)" }}>
              <BiDollar style={{ fontSize: "26px" }} />
              <Text style={{ fontSize: "18px", fontWeight: "bold", marginTop: "10px" }}>Fixed Price</Text>
            </TypeItem>
            <TypeItem style={{ cursor: "not-allowed", color: "rgb(229, 232, 235)" }}>
              <MdOutlineWatchLater style={{ fontSize: "26px" }} />
              <Text style={{ fontSize: "18px", fontWeight: "bold", marginTop: "10px", color: "rgb(229, 232, 235)" }}>
                Timed Auction
              </Text>
            </TypeItem>
          </TypeWrapper>

          <div style={{ display: "flex", justifyContent: "space-between", margin: "30px 0 10px 0" }}>
            <Text style={{ fontWeight: "bold" }}>Price</Text>
            <MdOutlineInfo style={{ fontSize: "26px" }} />
          </div>
          <PriceWrapper>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "16px",
                padding: "13px",
                border: "1px solid rgb(229, 232, 235)",
                borderRadius: "10px",
                backgroundColor: "rgba(229, 232, 235, 0.25)",
                flex: "40%",
              }}
            >
              <Image src="/images/eth.svg" width={24} height={24} alt="" />
              <div style={{ margin: "0 25px" }}>ETH</div>
              <IoIosArrowDown />
            </div>
            <div style={{ flex: "60%" }}>
              <CInput variant="default" placeholder="Amount" />
            </div>
          </PriceWrapper>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "30px 0 5px 0" }}>
              <Text style={{ fontWeight: "bold" }}>Fees</Text>
              <MdOutlineInfo style={{ fontSize: "26px" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text style={{ fontWeight: "bold", color: "rgb(112, 122, 131)" }}>Service Fee</Text>
              <Text style={{ fontWeight: "bold", color: "rgb(112, 122, 131)" }}>10%</Text>
            </div>
          </div>
          <Button size="lg" style={{ marginTop: "30px" }} color="teal">
            Complete Listing
          </Button>
        </div>
        <div>
          <TitleText>Preview</TitleText>
        </div>
      </SimpleGrid>
    </Container>
  );
};

export default Sell;

import React from "react";
import styled from "styled-components";
import CopyToClipboard from "react-copy-to-clipboard";

const GroupedIcons = ({ Items }) => {
  return (
    <IconContainer>
      {Items.map((item) => {
        return (
          <>
            {item.copy ? (
              <CopyToClipboard
                text={`${window.location.href}/${item.scheduleId}`}
                onCopy={item.action}
              >
                <ImageButton data-hover={item.desc}>
                  <img src={item.icon} alt={item.alt} />
                </ImageButton>
              </CopyToClipboard>
            ) : (
              <ImageButton onClick={item.action} data-hover={item.desc}>
                <img src={item.icon} alt={item.alt} />
              </ImageButton>
            )}
          </>
        );
      })}
    </IconContainer>
  );
};

const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const ImageButton = styled.div`
  justify-content: center;
  margin-left: 1rem;
  cursor: pointer;
  display: flex;
  position: relative;
  &:before,
  &:after {
    visibility: hidden;
    opacity: 0;
    z-index: 1;
    position: absolute;
  }
  &:before {
    content: attr(data-hover);
    width: max-content;
    height: 32px;
    background-color: #4e4e4e;
    color: #ffffff;
    text-align: center;
    border-radius: 8px;
    padding: 6px;
    right: 0;
    top: 130%;
    font-size: 14px;
  }
  &:after {
    content: "";
    border-style: solid;
    border-color: #4e4e4e transparent;
    border-width: 0 8px 10px;
    top: 100%;
    right: 3px;
  }
  &:hover&:before,
  &:hover&:after {
    opacity: 1;
    visibility: visible;
  }
`;

export default GroupedIcons;
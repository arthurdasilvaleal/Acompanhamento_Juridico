import styled from "styled-components"

export const Loading_Submit = styled.div`
    position: fixed;
    width: 100dvw;
    height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 9999;
`

export const LoadingOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
`
import styled from "styled-components"

export const LoadingStyle = styled.div`
    position: fixed;
    width: 100dvw;
    height: 100dvh;
    background-color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeOut 400ms linear 1.2s;
    @keyframes fadeOut {
        from{
            opacity: 1;
        }
        to{
            opacity: 0;
        }
    }
`
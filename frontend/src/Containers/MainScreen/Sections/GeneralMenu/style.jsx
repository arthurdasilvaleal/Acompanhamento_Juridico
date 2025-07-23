import styled from "styled-components"

export const CountProcesses = styled.div`
    display: flex;
    position: relative;
    padding: 10px;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    border: transparent;

    background-color: white;
    animation: pop-left 0.3s ease-in;
    @keyframes pop-left {
        from{
            opacity: 0;
            transform: translateX(-10px);
        }
        to{
            opacity: 1;
            transform: translateX(0);
        }
    }
`
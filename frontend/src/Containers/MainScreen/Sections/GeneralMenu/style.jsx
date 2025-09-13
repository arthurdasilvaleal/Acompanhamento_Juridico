import styled from "styled-components"

export const WorkerInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #343434;
    border: transparent;
    border-radius: 16px;
    color: white;
    padding: 10px;

    h1{
        padding: 10px 0;
        margin: auto;
        text-transform: capitalize;
    }

    hr{
        width: 100%;
        margin: 4px 7px;
    }   
`

export const MainWorker_Count = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400px;
    width: calc(100% - 20px); // Se faz necessário por causa do canvas "empurrar o elemento para fora" quando usado o padding
    background-color: white;
    border-radius: 16px;
    margin: 20px 0;
    padding: 10px;
`

export const AdmOnly_Button = styled.button`
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    border: transparent;
    border-radius: 16px;
    height: 40px;
    padding: 10px;
    transition: box-shadow 0.2s ease, background-color 0.2s ease;
    background-color: ${({ $submitButton }) => !$submitButton ? "rgba(229, 255, 0, 0.61)" : "#fff"};
    color: #000;
    outline: none;

    &:hover{
        box-shadow: -2px -3px 89px 5px rgba(229, 255, 0, 0.61);
        transition: box-shadow 0.2s ease, background-color 0.2s ease;
        background-color: rgba(229, 255, 0, 0.61);
    }
`

export const Info_Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 300px;
    margin: 20px 0;

    @media (max-width: 768px) {
        flex-direction: column;
        height: 600px;
    }
`

export const CountProcesses = styled.div`
    display: flex;
    position: relative;
    padding: 10px;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    border: transparent;
    height: 100%;
    width: calc(50% - 20px); // Se faz necessário por causa do canvas "empurrar o elemento para fora" quando usado o padding

    background-color: white;
    animation: pop-left 0.5s ease-in-out;
    
    @media (max-width: 768px) {
        height: 50%;
        width: 100%;
        padding: 0;
        border: 10px;
    }

    @keyframes pop-left {
        from{
            opacity: 0;
            transform: translateX(-20px);
        }
        to{
            opacity: 1;
            transform: translateX(0);
        }
    }
`
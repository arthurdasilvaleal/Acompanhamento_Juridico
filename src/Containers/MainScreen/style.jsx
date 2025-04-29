import styled from "styled-components"

export const Container = styled.main`
    display: flex;
    flex-direction: row;
    overflow: ${props => props.$isOpen ? `hidden` : `visible`};
`

export const Main_Menu = styled.aside`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    position: fixed;
    height: 100vh;
    width: 200px;
    background-color: #343434;
    color: #fff;
    z-index: 999;
    transition: transform 0.3s ease-in-out;
    transform: ${({ $isOpen }) => ($isOpen ? "translateX(0)" : "translateX(-100%)")};

    @media (min-width: 769px) {
        transform: translateX(0);
    }

    @media (max-width: 768px) {
        height: 103vh;
        justify-content: space-evenly;
    }

    img{
        width: inherit;
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
        @media (max-width: 1366px) and (max-height: 600px) {
         display: none;
        }

        @media (max-width: 768px) {
            display: none;
        }
    }

    ul{
        list-style-type: none;
        padding: 8rem 0 0 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        @media (max-width: 768px) {
            height: 40%;
            padding-top: 9rem;
        }
    }

    li{
        cursor: pointer;
        font-size: 20px;
        transition: 0.3s;
        height: 35px; //Faz a função do GAP
        text-align: center;
        padding-top: 13px;
    }

    li:hover, li[data-active="true"]{
        color: #CDAF6F;
        font-size: 21.5px;
        background-color: #2C2C2C;
    }

    #bottone1 {
        color: #fff;
        padding: 16px 0;
        margin-bottom: 30px;
        border-radius: 9px;
        background: #CDAF6F;
        border: none;
        font-family: inherit;
        text-align: center;
        cursor: pointer;
        transition: 0.4s;

        a{
            padding: 16px 33px;
            text-decoration: none;
            color: #fff;
        }
    }

    #bottone1:hover {
        box-shadow: 7px 5px 56px -2px #CDAF6F;
    }

    #bottone1:active {
        transform: scale(0.97);
        box-shadow: 7px 5px 56px -10px #CDAF6F;
    }
`

export const Main_ToggleButton = styled.button`
    position: fixed;
    top: 30px;
    left: 10px;
    width: 50px;
    height: 30px;
    z-index: 1000;
    background: none;
    border: none;
    cursor: pointer;
    background-color: #343434;
    border-radius: 5px;

    background-repeat: no-repeat;
    background-size: 60%;
    background-position: center;
    background-image: ${({ $isOpen }) => $isOpen
      ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23CDAF6F'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' /%3E%3C/svg%3E")`
      : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23CDAF6F'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12' /%3E%3C/svg%3E")`};


    @media (min-width: 769px) {
        display: none;
    }
`

export const Main_Content = styled.section`
    display: flex;
    flex-direction: column;
    margin-left: 200px; //adiciona a largura do menu ao calculo da largura total
    width: calc(100% - 200px); //retira a largura do menu do calculo da largura total
    color: #fff;
    position: relative;
    overflow: hidden;
    transition: filter 0.3s, transform 0.3s;
    transform: ${({ $isBlocked }) => ($isBlocked ? "translateX(10px)" : "translateX(0)")};
    z-index: 0;

    ${({ $isBlocked }) =>
        $isBlocked &&
        `
        filter: blur(3px);
        pointer-events: none;
        user-select: none;
    `};

    @media (max-width: 768px) {
        width: 100%;
        margin-left: 0;
    }
    
    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 300vmax;
        height: 300vmax;
        transform: translate(-50%, -50%);
        background: linear-gradient(163deg, #405357 30%, #634331 100%);
        animation: girarGradiente 15s linear infinite;
        z-index: -1;

        @media (max-width: 768px) {
            width: 400vmax;
            height: 400vmax;
        }
    }

    @keyframes girarGradiente {
        from {
            transform: translate(-50%, -50%) rotate(0deg) scale(1.1);
        }
        to {
            transform: translate(-50%, -50%) rotate(360deg) scale(1.1);
        }
    }

    h1{
        text-align: center;
        text-transform: uppercase;
    }

    hr{
        margin: 16px 10px;
    }
`

export const Main_Title = styled.header`
    text-align: center;
    padding: 1rem 0 0 0;
    background-color: #343434;
    
    hr{
        margin: 0;
        background-color: #CDAF6F;
        border: none;
        box-shadow: 0 0 30px #CDAF6F;
        height: 10px;
    }
`
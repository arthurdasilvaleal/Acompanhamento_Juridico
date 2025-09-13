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
    height: 100dvh;
    width: 200px;
    background-color: #343434;
    color: #fff;
    z-index: 998;
    transition: transform 0.3s ease-in-out;
    transform: ${({ $isOpen }) => ($isOpen ? "translateX(0)" : "translateX(-100%)")};

    ${({ $Exiting }) =>
        $Exiting &&
        `
        filter: blur(0.8px);
        pointer-events: none;
        user-select: none;`
    };

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

    .Info{
        padding-top: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    ul{
        list-style-type: none;
        padding: 3rem 0 0 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        @media (max-width: 768px) {
            height: 40%;
        }

        @media (max-width: 1366px) and (max-height: 600px){
            padding: 4rem 0 0 0;
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
        padding: 16px 33px;
        margin-bottom: 30px;
        border-radius: 9px;
        background: #CDAF6F;
        border: none;
        font-family: inherit;
        text-align: center;
        cursor: pointer;
        transition: 0.4s;

        /* a{
            padding: 16px 33px;
            text-decoration: none;
            color: #fff;
        } */
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
    z-index: 999;
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
    transition: filter 0.3s, transform 0.3s;
    z-index: 0;
    
    ${({ $isBlocked }) =>
        $isBlocked &&
        `
        filter: blur(3px);
        pointer-events: none;
        user-select: none;`
    };

    ${({ $Exiting }) =>
        $Exiting &&
        `
        filter: blur(0.8px);
        pointer-events: none;
        user-select: none;`
    };

    @media (max-width: 768px) {
        width: 100%;
        margin-left: 0;
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

export const Animated_background = styled.div`
    position: fixed;
    min-height: 950px;
    width: 100%;
    z-index: -1;
    background: linear-gradient(270deg, #405357, #928DAB, #634331);
    background-size: 600% 600%;
    animation: gradientAnimation 30s ease infinite;

    @keyframes gradientAnimation {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
`

export const Main_Title = styled.header`
    text-align: center;
    padding: 1rem 0 0 0;
    background-color: #343434;
    z-index: 1; // Bloquear o TsParticles
    
    hr{
        margin: 0;
        background-color: #CDAF6F;
        border: none;
        box-shadow: 0 0 30px #CDAF6F;
        height: 10px;
    }
`

export const Exit_card = styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    padding: 15px;
    border-radius: 16px;
    color: #000;
    text-align: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    z-index: 9999;

    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    // Evita da animação de saida "vazar" ao ser renderizado
    ${({ $Exiting, $Visible }) => {
        if (!$Visible) return `display: none;`;
        return `
            animation: ${$Exiting ? 'PopIn' : 'PopOut'} 0.3s ease forwards;
            pointer-events: ${$Exiting ? 'auto' : 'none'};
            user-select: ${$Exiting ? 'auto' : 'none'};
        `;
    }}

    @keyframes PopIn {
        from {
            opacity: 0;
            transform: translate(-50%, -45%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }

    @keyframes PopOut {
        from {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -45%);
        }
    }

    @media (min-width: 769px) {
        width: 350px;
    }

    h2{
        width: 280px;
    }

    svg{
        width: 30px;
        color: #CDAF6F;
        margin-left: auto;
        cursor: pointer;
    }


    a{
        margin: 0.5em;
    }

    .btn {
        width: 6.5em;
        height: 2.3em;
        background: black;
        border: none;
        color: white;
        border-radius: 0.625em;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        position: relative;
        z-index: 1;
        overflow: hidden;
        transition-property: color;
        transition: 0.3s ease-in-out;
    }

    button:hover {
        color: #000;
        transition: color 0.3s ease-in-out;
    }

    button:after {
        content: "";
        background: #fff;
        position: absolute;
        z-index: -1;
        left: -20%;
        right: -20%;
        top: 0;
        bottom: 0;
        transform: skewX(-45deg) scale(0, 1);
        transition: all 0.5s;
    }

    button:hover:after {
        transform: skewX(-45deg) scale(1, 1);
        -webkit-transition: all 0.5s;
        transition: all 0.5s;
    }
`
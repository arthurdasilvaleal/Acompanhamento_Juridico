import styled from "styled-components"

export const Container = styled.main`
    display: flex;
    flex-direction: row;
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
    z-index: 1;

    @media  (max-width: 768px){
        display: none;
    }

    img{
        width: inherit;
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
        @media (max-width: 1366px) and (max-height: 600px) {
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

export const Main_Content = styled.section`
    display: flex;
    flex-direction: column;
    margin-left: 200px; //adiciona a largura do menu ao calculo da largura total
    width: calc(100% - 200px); //retira a largura do menu do calculo da largura total
    color: #fff;
    position: relative;
    overflow: hidden;
    z-index: 0;

    @media (max-width: 768px) {
        width: 100%;
        margin-left: 0;
    }
    
    &::before{
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 300vw;
        height: 300vh;
        transform: translate(-50%, -50%);
        background: linear-gradient(163deg, #405357 30%, #634331 100%);
        animation: girarGradiente 15s linear infinite;
        z-index: -1;
        
        @media (max-width: 768px) {
            height: 400vh;
            width: 400vw;
        }
    }

    @keyframes girarGradiente {
        from {
            transform: translate(-50%, -50%) rotate(0deg);
        }
        to {
            transform: translate(-50%, -50%) rotate(360deg);
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
    margin-bottom: 20px;
    background-color: #343434;
    
    hr{
        margin: 0;
        background-color: #CDAF6F;
        border: none;
        box-shadow: 0 0 30px #CDAF6F;
        height: 10px;
    }
`
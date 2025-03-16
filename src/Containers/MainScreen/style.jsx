import styled from "styled-components"

export const Container = styled.div`
    display: flex;
    flex-direction: row;
`

export const Main_Menu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 100vh;
    width: 200px;
    background-color: #343434;
    color: #fff;

    img{
        width: inherit;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    ul{
        list-style-type: none;
        padding: 5rem 0 0 0;
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
        padding: 16px 33px;
        margin-bottom: 30px;
        border-radius: 9px;
        background: #ff0000;
        border: none;
        font-family: inherit;
        text-align: center;
        cursor: pointer;
        transition: 0.4s;

        a{
            text-decoration: none;
            color: #fff;
        }
    }

    #bottone1:hover {
        box-shadow: 7px 5px 56px -2px #a71c1c;
    }

    #bottone1:active {
        transform: scale(0.97);
        box-shadow: 7px 5px 56px -10px #ff0000;
    }
`

export const Main_Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    width: calc(100% - 200px);
    background-color: #2C2C2C;
    color: #fff;
`
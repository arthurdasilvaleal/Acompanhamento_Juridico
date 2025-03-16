import styled from "styled-components"

export const Container = styled.div`
    display: flex;
    flex-direction: row;
`

export const Main_Menu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
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
        padding: 5rem 0;
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

    li:hover{
        color: #CDAF6F;
        font-size: 21.5px;
        background-color: #2C2C2C;
    }

    li[data-active="true"]{
        color: #CDAF6F;
        font-size: 21.5px;
        background-color: #2C2C2C;
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
import styled from "styled-components"

export const ShowClientes = styled.div`
    opacity: ${({ $addClientes, $editClientes }) => ($editClientes || $addClientes) ? "0" : "1"};
    pointer-events: ${({ $addClientes, $editClientes }) => ($editClientes || $addClientes) ? "none" : ""};
    transition: all 0.2s ease-in-out;
`

export const Search_box = styled.div`
    display: flex;
    padding: 20px;
    position: relative;
    overflow: hidden;
    z-index: 1; 

    background-color: #2b2b2b;
    border: #adadad solid;
    border-top: 0;
    border-left: 0;
    border-right: 0;
    align-items: center;

    @media (max-width: 768px) {
        padding: 20px 5px;
    }

    input{
        height: 40px;
        width: 20vw;
        background-color: #00000039;
        color: #fff;
        border-radius: .5rem;
        padding: 0 1rem;
        border: 2px solid transparent;
        font-size: 1rem;
        transition: border-color .3s cubic-bezier(.25,.01,.25,1) 0s, color .3s cubic-bezier(.25,.01,.25,1) 0s,background .2s cubic-bezier(.25,.01,.25,1) 0s;

        @media (max-width: 768px) {
            width: 45dvw;
        }
    }

    label{
        font-size: .9rem;
        font-weight: bold;
        width: 150px;
        color: #fff;
        transition: color .3s cubic-bezier(.25,.01,.25,1) 0s;
        text-align: center;
        align-content: center;

        @media (max-width: 768px) {
            width: 50px;
            padding-right: 10px;
        }
    }

    // Texto para Desktop
    @media (max-width: 768px) {
        #desktopLabel{
            display: none;
        }
    }
    
    // Texto para Mobile
    @media (min-width: 769px) {
        #mobileLabel{
            display: none;
        }
    }

    input:hover, input:focus  {
        outline: none;
        border-color: #fff;
    }
`

export const Consult_button = styled.button`
    color: #fff;
    width: 170px;
    height: 48px;
    /* margin-top: 25px; */
    margin-left: auto;
    border-radius: 9px;
    background: #CDAF6F;
    border: none;
    font-family: inherit;
    text-align: center;
    cursor: pointer;
    transition: box-shadow 250ms, transform 250ms, background-color 0.8s ease;

    @media (max-width: 768px) {
        width: 50px;
        border-radius: 24px;
        /* margin-left: 50px; */
    }

    svg{
        @media (min-width: 769px) {
            display: none;
        }
        width: 20px;
        padding-left: 3px;
        padding-top: 3px;
    }

    p{
        @media (max-width: 768px) {
            display: none;
        }
    }
    
    &:hover{
        box-shadow: 7px 5px 56px -2px #CDAF6F;
        transition: box-shadow 250ms, background-color 0.8s ease;
    }

    &:active{
        transform: scale(0.97);
        box-shadow: 7px 5px 56px -10px #CDAF6F;
        transition: box-shadow 250ms, transform 250ms, background-color 0.8s ease;
    }
`

export const Grid_Box = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 10px;
    @media (max-width: 768px) {
        justify-content: space-around;

        .onlyDesktop{
            display: none;
        }
    }
`

export const Card_Cliente = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    box-shadow: 0px 11px 73px 0px rgba(0,0,0,0.3);
    cursor: pointer;
    margin: 5px;
    position: relative;
    backdrop-filter: blur(10px);
    transition: transform 0.2s ease, max-height 0.4s cubic-bezier(.17,.6,.53,.91), opacity 0.3s ease;
    overflow: hidden;
    opacity: ${({ $fullDetailed }) => $fullDetailed ? "1" : "0"};
    pointer-events: ${({ $fullDetailed }) => $fullDetailed ? "" : "none"};
    
    /* width: 250px; */

    max-height: ${({ $detailed, $fullDetailed }) => {
        if($detailed && !$fullDetailed){return "260px"}
        else if($detailed && $fullDetailed){return "600px"}
        else{return "120px"}}
    };

    .card-Content{
        padding: 10px;
        
    }

    p{
        margin: 5px 0;
        white-space: normal;
        overflow-wrap: break-word;
        word-break: break-all;
    }

    hr{
        margin: 10px 0;
    }

    h6{
        display: flex;
        position: relative;
        margin: 0;
        align-items: center;
        justify-content: center;
        transition: box-shadow 0.2s ease;
        padding: 10px 0;
        border-radius: 8px;
        width: 100%;
        overflow: hidden;
    }

    h6::before{
        content: '';
        width: 0;
        height: 0;
        background-color: #CDAF6F;
        position: absolute;
        border-radius: 16px;
        transition: width 0.6s ease, height 0.6s ease;
        z-index: -1;
    }

    .Delete::before{
        background-color: #cd6f6f;
    }

    h6:hover::before{
        width: 100%;
        height: 200px;
        transition: width 0.6s ease, height 0.6s ease;
    }

    h4{
        text-align: center;
        margin: 0;
    }

    //bordas

    //Parte de cima
    &::before{
        content: '';
        position: absolute;
        left: 0;
        height: 5px;
        width: ${({ $detailed }) => $detailed ? "100%" : "0"};
        background-color: #fff;
        transition: width 0.4s ease-in-out;
        border-radius: 0 0 12px 12px;
    }

    //Parte da esquerda
    &::after{
        content: '';
        left: 0;
        position: absolute;
        height: ${({ $detailed }) => $detailed ? "100%" : "0"};
        width: 5px;
        background-color: #fff;
        transition: height 0.4s ease-in-out;
        border-radius: 12px;
    }

    &:hover{
        transform: translateY(-5px);

        &::before{
            width: 100%;
        }

        &::after{
            height: 100%;
        }
    }
`
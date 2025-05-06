import styled from "styled-components"

export const Consult_form = styled.form`
    display: flex;
    flex-direction: row;
    padding: 20px 30px 0 30px;
    gap: 20px;
    background-color: #00000070;
    overflow: hidden;

    // Pode quebrar
    height: ${({ $Enviado }) => $Enviado ? `150px` : `calc(100vh - 148px)`};
    transition: height 0.9s cubic-bezier(0.3, 0.2, 0.2, 1);

    @media (max-width: 1280px) and (max-height: 600px){
        height: ${({ $Enviado }) => $Enviado ? `150px` : `calc(100vh - 149px)`};
    }

    @media (max-width: 768px){
        display: flex;
        flex-direction: column;
        height: ${({ $Enviado }) => $Enviado ? `240px` : `calc(100vh - 170px)`};
        padding-left: 0;
        padding-right: 0;
    }

    .GroupBy{
        display: flex;
        flex-direction: column;
        gap: 10px;
        height: 105px;
    }

    .input-group{
        display: flex;
        gap: 20px;
        text-align: end;
        height: 48px;
    }

    .input {
        height: 44px;
        width: 30vw;
        background-color: #00000039;
        color: #fff;
        border-radius: .5rem;
        padding: 0 1rem;
        font-size: 1rem;
        transition: border-color .3s cubic-bezier(.25,.01,.25,1) 0s, color .3s cubic-bezier(.25,.01,.25,1) 0s,background .2s cubic-bezier(.25,.01,.25,1) 0s;
        @media (max-width: 768px){
            width: 40vw;
        }
    }

    .label {
        font-size: .9rem;
        place-content: center;
        font-weight: bold;
        width: 150px;
        color: #CDAF6F;
        transition: color .3s cubic-bezier(.25,.01,.25,1) 0s;
    }

    .input:hover, .input:focus, .input-group:hover .input {
        outline: none;
        border-color: #fff;
    }
`

export const Consult_button = styled.button`
    color: #fff;
    width: 170px;
    height: 48px;
    margin-top: 25px;
    padding: 16px 33px;
    border-radius: 9px;
    background: #CDAF6F;
    border: none;
    font-family: inherit;
    text-align: center;
    cursor: pointer;
    transition: box-shadow 250ms, transform 250ms;
    
    &:hover{
        box-shadow: 7px 5px 56px -2px #CDAF6F;
        transition: box-shadow 250ms;
    }

    &:active{
        transform: scale(0.97);
        box-shadow: 7px 5px 56px -10px #CDAF6F;
        transition: box-shadow 250ms, transform 250ms;
    }

    @media (max-width: 768px){
        margin-left: 20vw;
    }
`

export const NotFound_Error = styled.p`
    display: flex;
    color: red;
    transition: opacity 0.5s ease;
    margin: 0 0 0 170px;
    width: 190px;
`

export const InputError = styled.input`
    border: ${ props => props.$found_data ? `2px solid red` : `2px solid transparent`};
`

export const Process_Cards = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0;
    transition: background-color 150ms ease;
    min-height: calc(100vh - 298px);

    @media (max-width: 768px) {
        min-height: calc(100vh - 370px);
    }

    .OneCard > h2{
        display: flex;
        align-items: center;
        height: 48px;
        justify-content: center;
        margin: 0;
        padding: 20px;
        cursor: pointer;
        transition: font-size 0.2s, background-color 0.5s;
        text-decoration: none;
    }

    .OneCard > hr{
        border-color: #ffffff9d;
        height: 2px;
        margin: 0;
        background-color: #ffffff9d;
    }

    .OneCard > h2:hover{
        font-size: 1.6em;
        transition: font-size 0.2s, background-color 0.5s;
        background-color: #000;
    }

    .OneCard > h2:active{
        font-size: 1.5em;
        transition: font-size 0.2s;
    }
`

export const Card_Title = styled.h2`
    font-size: ${({ $cardOpen }) => $cardOpen ? "1.6em" : "1.5em"};
    background-color: ${({ $cardOpen }) => $cardOpen ? "#000" : "none"};
`

export const Card = styled.div`
    max-height: ${({ $cardOpen }) => $cardOpen ? "500px" : "0"};
    opacity: ${({ $cardOpen }) => $cardOpen ? "1" : "0"};
    transform: ${({ $cardOpen }) => $cardOpen ? "translateY(0)" : "translateY(-30px)"};
    overflow: hidden;
    transition: max-height 0.2s ease-out, opacity 1s ease, transform 0.8s ease-out;
    background-color: #00000070;
    display: flex;
    flex-direction: row;
    gap: 30px;


    .Client-info{
        overflow: hidden;
        width: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: start;
        padding: 10px 10px 20px;
    }

    .Client-info > *{
        margin: 10px 0 0 0;
    }

`
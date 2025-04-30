import styled from "styled-components"

export const Consult_form = styled.form`
    display: flex;
    flex-direction: row;
    padding: 20px 30px 0 30px;
    gap: 20px;
    background-color: #00000070;
    overflow: hidden;

    // Pode quebrar
    height: ${({ $Enviado }) => $Enviado ? `163px` : `calc(100vh - 148px)`};
    transition: height 0.9s cubic-bezier(0.3, 0.2, 0.2, 1);

    @media (max-width: 768px){
        display: flex;
        flex-direction: column;
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

export const Process_Card = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;

    .Client-info{
        width: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        margin-left: auto;
    }

    .Client-info > *{
        margin: 10px 0 0 0;
    }

    hr{
        margin: 10px 0;
    }
`
import styled from "styled-components"

export const Consult_form = styled.form`
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 10px 30px;
    gap: 20px;
    background-color: #00000070;
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        justify-content: start;
    }
    
    // Pode quebrar
    height: ${({ $Enviado }) => $Enviado ? `163px` : `calc(100vh - 148px)`};
    transition: height 0.9s cubic-bezier(0.3, 0.2, 0.2, 1);

    .input-group{
        display: flex;
        gap: 20px;
        padding-bottom: 10px;
        text-align: end;

        .input{
            width: 30vw;
        }
    }

    .input, .input-select {
        height: 44px;
        background-color: #00000039;
        color: #fff;
        border-radius: .5rem;
        padding: 0 1rem;
        border: 2px solid transparent;
        font-size: 1rem;
        transition: border-color .3s cubic-bezier(.25,.01,.25,1) 0s, color .3s cubic-bezier(.25,.01,.25,1) 0s,background .2s cubic-bezier(.25,.01,.25,1) 0s;
    }

    .label {
        height: 48px;
        font-size: .9rem;
        place-content: center;
        font-weight: bold;
        width: 150px;
        color: #CDAF6F;
        transition: color .3s cubic-bezier(.25,.01,.25,1) 0s;
    }

    .input:hover, .input:focus, .input-group:hover .input, select:focus  {
        outline: none;
        border-color: #fff;
    }
`

export const Consult_button = styled.button`
    color: #fff;
    width: 170px;
    height: 48px;
    /* margin-left: 170px; */
    padding: 16px 33px;
    border-radius: 9px;
    background: #CDAF6F;
    border: none;
    font-family: inherit;
    text-align: center;
    cursor: pointer;
    transition: all 250ms;
    
    &:hover{
        box-shadow: 7px 5px 56px -2px #CDAF6F;
        transition: all 250ms;
    }

    &:active{
        transform: scale(0.97);
        box-shadow: 7px 5px 56px -10px #CDAF6F;
        transition: all 250ms;
    }
`
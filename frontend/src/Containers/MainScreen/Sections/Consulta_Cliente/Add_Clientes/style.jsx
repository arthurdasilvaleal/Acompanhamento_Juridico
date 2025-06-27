import styled from "styled-components"

export const FixedBox = styled.div`
    position: absolute;
    width: calc(100vw - 220px);
    top: 220px;
    opacity: ${({ $show }) => $show ? "1" : "0"};
    
    z-index: 1;
    transition: opacity 0.3s ease-out;
    
    @media (max-width: 768px) {
        width: calc(100vw - 20px);
        top: 240px;

        h1{
            font-size: 1.2rem;
            margin-left: 100px;
        }
    }
    
    hr{
        margin-left: 30px;
    }
`

export const Client_form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;

    .input-group{
        display: flex;
        align-items: center;
        gap: 20px;
        padding-bottom: 10px;
        text-align: end;

        .input{
            width: 30vw;
        }

        textarea{
            padding: 1rem 1rem;
            height: 100px;
            resize: none;
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
        font-size: .9rem;
        font-weight: bold;
        width: 150px;
        color: #CDAF6F;
        transition: color .3s cubic-bezier(.25,.01,.25,1) 0s;
    }

    .input:hover, .input:focus, .input-group:hover .input, select:focus  {
        outline: none;
        border-color: #fff;
    }

    .left-form{
        display: flex;
        flex-direction: column;
    }

    .input-group-select{
        display: flex;
        align-items: center;
        gap: 20px;
        padding-bottom: 10px;

        .input-select{
            width: calc(30vw + 36px);
        }

        option{
            background-color: #00000039;
            color: #000;
        }

        .label{
            text-align: end;
        }
    }
`

export const Client_button = styled.button`
    color: #fff;
    margin: 16.5px 0;
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
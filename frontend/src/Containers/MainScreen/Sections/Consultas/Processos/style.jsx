import styled from "styled-components"

export const FixedBox = styled.div`
    position: absolute;
    width: calc(100vw - 200px);
    top: 130px;
    opacity: ${({ $Show }) => $Show ? "1" : "0"};
    z-index: 1;
    transition: opacity 0.3s ease-out;
    @media (max-width: 768px) {
        width: 100vw;
    }
`

export const Process_Form = styled.form`
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
            height: 50px;
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

    .input-group-select, .input-group-select-mid{
        display: flex;
        align-items: center;
        gap: 20px;

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

    .input-group-select-mid{
        padding-bottom: ${({ $clientSelect }) => $clientSelect ? '0' : '10px'};;
        height: ${({ $clientSelect }) => $clientSelect ? '0' : '44px'};
        opacity: ${({ $clientSelect }) => $clientSelect ? '0' : '1'};
        pointer-events: ${({ $clientSelect }) => $clientSelect ? 'none' : 'auto'};;
        transition: 0.2s ease;
    }

    .form-button{
        margin-top: 31px;
    }
`

export const Process_back_button = styled.button`
    position: absolute;
    display: flex;
    align-items: center;
    top: 13px;
    left: 20px;
    width: 40px;
    height: 40px;
    color: #fff;
    padding: 0;
    border-radius: 20px;
    border: 1px solid #fff;
    background-color: transparent;
    font-family: inherit;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.3s ease-out, border 0.1s ease, width 0.3s ease-in-out;
    overflow: hidden;
    
    svg{
        width: 20px;
        margin-left: 9px;
    }

    span{
        position: absolute;
        opacity: 0;
        left: 50px;
        transition: left 0.3s ease-in-out, opacity 0.4s ease;
    }

    &:hover{
        width: 80px;
        background: #CDAF6F;
        box-shadow: 7px 5px 56px -2px #CDAF6F;
        border: none;
        transition: all 400ms;
        span{
            left: 33px;
            transition: left 0.3s ease-in-out, opacity 0.2s ease;
            opacity: 1;
        }
    }
`

export const Process_button = styled.button`
    color: #fff;
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
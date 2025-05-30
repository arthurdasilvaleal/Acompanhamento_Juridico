import styled from "styled-components"

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
        margin-top: 40px;
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
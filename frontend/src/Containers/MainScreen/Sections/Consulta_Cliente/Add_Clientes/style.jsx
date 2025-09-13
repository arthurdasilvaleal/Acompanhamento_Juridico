import styled from "styled-components"

export const FixedBox = styled.div`
    position: absolute;
    width: calc(100vw - 220px);
    top: 140px;
    opacity: ${({ $show, $showEdit }) => ($show || $showEdit) ? "1" : "0"};
    transform: ${({ $show, $showEdit }) => ($show || $showEdit) ? "translateX(0)" : "translateX(-100%)"};
    z-index: 1;
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    
    @media (max-width: 768px) {
        width: calc(100vw - 20px);
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
            scroll-behavior: smooth;
            scrollbar-width: thin;
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

export const Client_back_button = styled.button`
    position: absolute;
    display: flex;
    align-items: center;
    top: 13px;
    left: 30px;
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

    @media (max-width: 768px) {
        width: 30px;
        height: 30px;
        width: 80px;
        background: #CDAF6F;
        box-shadow: 7px 5px 56px -2px #CDAF6F;
        border: none;
    }
    
    svg{
        width: 20px;
        margin-left: 9px;
        transition: transform 200ms ease;

        @media (max-width: 768px) {
            margin-left: 4px;
        }
    }

    span{
        position: absolute;
        opacity: 0;
        left: 50px;
        transition: left 0.3s ease-in-out, opacity 0.4s ease;
        @media (max-width: 768px) {
            left: 33px;
            opacity: 1;
        }
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

        svg{
            transform: translateX(-3px);
            transition: transform 200ms ease;
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
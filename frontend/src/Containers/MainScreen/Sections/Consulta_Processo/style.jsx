import styled from "styled-components"

export const Consult_form = styled.form`
    display: flex;
    flex-direction: row;
    padding: 20px 30px 0 30px;
    gap: 40px;
    background-color: #2b2b2b;
    overflow: hidden;
    transform: ${({ $processOpen }) => $processOpen ? "translateX(-100%)" : "translateX(0)"};
    z-index: 2;
    

    // Pode quebrar
    height: ${({ $Enviado }) => $Enviado ? `150px` : `calc(100vh - 148px)`}; //Envio do form
    max-height: ${({ $cardOpen }) => $cardOpen ? "calc(100vh - 148px)" : "0"}; //Abertura do cartão
    padding-top: ${({ $cardOpen }) => $cardOpen ? "20px" : "0"};
    transition: padding 0.9s ease, height 0.9s cubic-bezier(0.3, 0.2, 0.2, 1), max-height 0.9s ease, transform 0.4s ease-in-out;
    

    @media (max-width: 1280px) and (max-height: 600px){
        height: ${({ $Enviado }) => $Enviado ? `150px` : `calc(100vh - 149px)`};
    }

    @media (max-width: 768px){
        display: flex;
        flex-direction: column;
        height: ${({ $Enviado }) => $Enviado ? `240px` : `calc(100vh - 148px)`};
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
    /* margin-top: 25px; */
    padding: 16px 33px;
    border-radius: 9px;
    background: #CDAF6F;
    border: none;
    font-family: inherit;
    text-align: center;
    cursor: pointer;
    transition: box-shadow 250ms, transform 250ms, background-color 0.8s ease;
    // TODO: Impedir que o usuário mude de processo no meio da transição (Apesar de não quebrar nada)
    
    &:hover{
        box-shadow: 7px 5px 56px -2px #CDAF6F;
        transition: box-shadow 250ms, background-color 0.8s ease;
        svg{
            transition: transform 0.2s ease;
            transform: rotate(180deg);
        }
    }

    &:active{
        transform: scale(0.97);
        box-shadow: 7px 5px 56px -10px #CDAF6F;
        transition: box-shadow 250ms, transform 250ms, background-color 0.8s ease;

    }

    
    background-color: ${({ $buttonTaskOpen }) => $buttonTaskOpen ? "#eca305" : "#CDAF6F"};
`

export const Twin_Button = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    @media (max-width: 768px) {
        margin-left: auto;
        margin-right: auto;
        flex-direction: row;
    }
    .add-processo-button{
        opacity: ${({ $disableForProcess }) => $disableForProcess ? "0" : "1"};
        pointer-events: ${({ $disableForProcess }) => $disableForProcess ? "none" : "all"};
        transition: all 250ms ease-in-out;
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
    z-index: 2;
    display: ${({ $processOpen }) => $processOpen ? "none" : "flex"};
    min-height: ${({ $cardOpen }) => $cardOpen ? "calc(100vh - 298px)" : "calc(100vh - 128px)"};
    transition: min-height 0.8s ease-out, background-color 150ms ease;

    @media (max-width: 768px) {
        transition: min-height 830ms;
        min-height: ${({ $cardOpen }) => $cardOpen ? "calc(100vh - 388px)" : "calc(100vh - 128px)"};
    }

    @media (max-width: 1280px) and (max-height: 600px){
        min-height: ${({ $cardOpen }) => $cardOpen ? `calc(100vh - 299px)` : `calc(100vh - 129px)`};
        transition: min-height 830ms;
    }

    .OneCard > h2{
        display: flex;
        height: 48px;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 20px;
        cursor: pointer;
        transition: font-size 0.2s, background-color 0.5s;
        text-decoration: none;
        text-align: center;
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
    max-height: ${({ $cardOpen }) => $cardOpen ? "20000px" : "0"};
    opacity: ${({ $cardOpen }) => $cardOpen ? "1" : "0"};
    transform: ${({ $cardOpen }) => $cardOpen ? "translateY(0)" : "translateY(-30px)"};
    padding: ${({ $cardOpen }) => $cardOpen ? "20px" : "0"};
    overflow: hidden;
    transition: padding 0.2s ease, max-height 0.2s ease-out, opacity 1s ease, transform 0.8s ease-out;
    background-color: #00000070;
    display: flex;
    flex-direction: column;
    gap: 20px;
    /* align-items: center; */
    
    .Core-data{
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 15px;

        .Client-info{
            overflow: hidden;
            width: fit-content;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: start;
            padding: 10px 10px 20px;
            background-color: #00000070;
            border-radius: 16px;

        }

        .Client-info > *{
            margin: 10px 0 0 0;
        }
    }

`

export const First_info = styled.div`
    display: flex;
    justify-content: space-around;
    gap: 10px;

    @media (max-width: 768px){
        flex-direction: column;
    }
    
    button{
        background-color: ${({ $buttonOpen }) => $buttonOpen ? "#CDAF6F" : "#eca305"};
    }

    button:hover{
        box-shadow: ${({ $buttonOpen }) => $buttonOpen ? "7px 5px 56px -2px #CDAF6F" : "7px 5px 56px -2px #eca305"};
    }
`

export const Consult_IntForm = styled.form`
    display: flex;
    flex-direction: column;
    padding: ${({ $buttonOpen }) => $buttonOpen ? "0" : "20px 30px"};
    gap: 20px;
    background-color: #00000070;
    overflow: hidden;
    border-radius: 16px;
    height: ${({ $buttonOpen }) => $buttonOpen ? "0" : "334px"};
    transform: ${({ $buttonOpen }) => $buttonOpen ? "translateX(20px)" : "translateX(0)"};
    opacity: ${({ $buttonOpen }) => $buttonOpen ? "0" : "1"};
    pointer-events: ${({ $buttonOpen }) => $buttonOpen ? "none" : ""};
    transition: transform 0.2s ease, opacity 0.2s ease, height 0.8s ease, padding 0.4s ease;

    & > h2{
        text-align: center;
        text-transform: uppercase;
        margin: 10px 0;
    }

    & > hr{
        margin: 0;
        background-color: #CDAF6F;
        border: none;
        box-shadow: 0 0 30px #CDAF6F;
        height: 2px;
    }

    .GroupBy{
        display: flex;
        flex-direction: column;
        gap: 10px;
        height: 105px;
    }

    .input-group{
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .input, .input-select {
        height: 44px;
        width: 30vw;
        background-color: #00000039;
        color: #fff;
        border: 2px solid transparent;
        border-radius: .5rem;
        padding: 0 1rem;
        font-size: 1rem;
        transition: border-color .3s cubic-bezier(.25,.01,.25,1) 0s, color .3s cubic-bezier(.25,.01,.25,1) 0s,background .2s cubic-bezier(.25,.01,.25,1) 0s;
        @media (max-width: 768px){
            width: auto;
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

    .input:hover, .input:focus, .input-group:hover .input, .input-select:hover, .input-select:focus {
        outline: none;
        border-color: #fff;
    }
    
    .input-group-select{
        display: flex;
        flex-direction: column;
        gap: 10px;

        .input-select{
            width: calc(30vw + 36px);
            @media (max-width: 768px) {
                width: auto;
            }
        }

        option{
            background-color: #00000039;
            color: #000;
        }
    }

    .formInt{
        height: ${({ $buttonOpen }) => $buttonOpen ? "0" : "calc(340px)"};
    }

    #ds_Intimacao{
        height: 126px;
        padding-top: 20px;
        resize: none;
    }

    button{
        margin: auto;
    }   
`

export const Intimacao_card = styled.div`
    // Separação das Intimações
    & > hr{

        margin: 0;
        background-color: #ffffff;
        border: none;
        box-shadow: 0 0 25px #ffffff;
        height: 2px;
    }

    .Intimacao-group{
        hr{
            margin: 10px 0 0 0;
        }

        .addTask{
            display: flex;
            flex-direction: row;
            gap: 10px;
            @media (max-width: 768px) {
                flex-direction: column;
                align-items: center;
            }
        } 
    }
`

export const Consult_TaskForm = styled.form`
    display: flex;
    flex-direction: column;
    padding: ${({ $addTaskOpen }) => !$addTaskOpen ? "0" : "20px 30px"};
    gap: 20px;
    background-color: #00000070;
    overflow: hidden;
    border-radius: 16px;
    margin: auto;
    height: ${({ $addTaskOpen }) => !$addTaskOpen ? "0" : "522px"}; 
    opacity: ${({ $addTaskOpen }) => !$addTaskOpen ? "0" : "1"};
    pointer-events: ${({ $addTaskOpen }) => !$addTaskOpen ? "none" : ""};
    transition: transform 0.2s ease, opacity 0.2s ease, height 0.6s ease, padding 0.4s ease;

    @media (max-width: 768px) {
        width: 70dvw;
    }

    & > h2{
        text-align: center;
        text-transform: uppercase;
        margin: 10px 0;
    }

    & > hr{
        margin: 0;
        background-color: #CDAF6F;
        border: none;
        box-shadow: 0 0 30px #CDAF6F;
        height: 2px;
    }

    .GroupBy{
        display: flex;
        flex-direction: column;
        gap: 10px;
        height: 105px;
    }

    .input-group{
        display: flex;
        flex-direction: column;
        gap: 10px;

        textarea{
            resize: none;
            padding: 20px;
            height: 100px;
        }

        input[type="date"]::-webkit-calendar-picker-indicator{
            filter: invert(1); /* inverte a cor — útil em temas escuros */
            cursor: pointer;
        }
    }

    .input, .input-select {
        height: 44px;
        width: 30vw;
        background-color: #00000039;
        color: #fff;
        border: 2px solid transparent;
        border-radius: .5rem;
        padding: 0 1rem;
        font-size: 1rem;
        transition: border-color .3s cubic-bezier(.25,.01,.25,1) 0s, color .3s cubic-bezier(.25,.01,.25,1) 0s,background .2s cubic-bezier(.25,.01,.25,1) 0s;
        @media (max-width: 768px){
            width: auto;
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

    .input:hover, .input:focus, .input-group:hover .input, .input-select:hover, .input-select:focus {
        outline: none;
        border-color: #fff;
    }
    
    .input-group-select{
        display: flex;
        flex-direction: column;
        gap: 10px;

        .input-select{
            width: calc(30vw + 36px);
            @media (max-width: 768px) {
                width: auto;
            }
        }

        option{
            background-color: #00000039;
            color: #000;
        }
    }

    button{
        margin: auto;
    }
`

export const Task_card = styled.div`
    
`
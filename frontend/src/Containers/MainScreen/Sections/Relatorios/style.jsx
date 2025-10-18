import styled from "styled-components"
import Select from "react-select"

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100dvh - 200px);
`

export const FilterBox = styled.div`
    width: 100%;
    padding: 20px 0;
    background-color: #2b2b2b;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .input-group-select{
        display: flex;
        align-items: center;
        gap: 20px;
        padding-bottom: 10px;

        @media (max-width: 768px){
            flex-direction: column;
        }

        select{
            width: calc(20vw + 36px);
            height: 44px;
            background-color: #00000039;
            color: #fff;
            border-radius: .5rem;
            padding: 0 1rem;
            border: 2px solid transparent;
            font-size: 1rem;
            transition: border-color .3s cubic-bezier(.25,.01,.25,1) 0s, color .3s cubic-bezier(.25,.01,.25,1) 0s,background .2s cubic-bezier(.25,.01,.25,1) 0s;
            
            @media (max-width: 768px){
                width: auto;
            }
        }

        select:hover, select:focus{
            outline: none;
            border-color: #fff;
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

export const StyledSelect = styled(Select)`
  /* --- 1. Estilos do :control --- */
    & .react-select__control {
        background-color: #00000039;
        min-height: 48px;
        width: calc(30vw + 36px);
        border-radius: 8px;
        border: ${props => (props.$found_data ? '2px solid #ff4d4d' : '1px solid transparent')};
        box-shadow: none;
        cursor: text;

    &:hover {
        border-color: #fff;
    }

    /* Media Query para responsividade */
    @media (max-width: 768px) {
        width: calc(40vw + 36px);
    }
  }

  /* Estilo para o :control quando está focado */
    & .react-select__control--is-focused {
        border-color: #fff;
        box-shadow: none; /* Você tinha 'none' aqui, então removemos a sombra de foco */
    }

    /* --- 2. Estilos do :input e :singleValue (o texto dentro) --- */
    & .react-select__input-container,
    & .react-select__single-value {
        color: #e0e0e0;
    }

    /* --- 3. Estilo do :placeholder --- */
    & .react-select__placeholder {
        color: #888;
    }

    /* --- 4. Estilo do :menu (o dropdown) --- */
    & .react-select__menu {
        background-color: #2c2c2c;
        border-radius: 8px;
        z-index: 5;
    }

    /* --- 5. Estilo da :option (cada item da lista) --- */
    & .react-select__option {
        background-color: transparent;
        color: #e0e0e0;
        cursor: pointer;

        &:active {
        background-color: #CDAF6F;
        }
    }
    
    /* Estilo da :option quando está com hover/foco */
    & .react-select__option--is-focused {
        background-color: #4f4f6a;
    }

    /* Estilo da :option quando já está selecionada */
    & .react-select__option--is-selected {
        background-color: #CDAF6F;
        color: #1a1a1a;
        font-weight: 500;
    }
`

// Barra de carregamento. Quando a barra completar, o download será liberado
export const Charge_bar = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${({ $Status }) => $Status === 5 ? "5px" : "0"};;
    width: ${({ $Status }) => $Status === 1 ? "20%" : 
            $Status === 2 ? "40%" :
            $Status === 3 ? "60%" :
            $Status === 4 ? "80%" :
            $Status === 5 ? "40%" : "0"};
    height: ${({ $Status }) => $Status === 5 ? "120px" : "10px"};
    background-color: #CDAF6F;
    border: none;
    margin-top: ${({ $Status }) => $Status === 5 ? "20px" : "0"};
    transform: ${({ $Status }) => $Status === 5 ? "translateX(70%)" : "translateX(0)"};
    box-shadow: 0 0 20px #CDAF6F;
    border-top-right-radius: ${({ $Status }) => $Status === 5 ? "0" : "6px"};
    border-bottom-right-radius: ${({ $Status }) => $Status === 5 ? "0" : "6px"};
    border-radius: ${({ $Status }) => $Status === 5 ? "12px" : ""};
    transition: width 1s cubic-bezier(.51,.06,.48,.99), 
        height 700ms cubic-bezier(.51,.06,.48,.99), 
        border-radius 500ms cubic-bezier(.51,.06,.48,.99), 
        transform 500ms cubic-bezier(.51,.06,.48,.99) 300ms, 
        margin-top 500ms cubic-bezier(.51,.06,.48,.99);
    overflow: hidden;

    & > div{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
`

export const Download_Button = styled.button`
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    border: transparent;
    border-radius: 16px;
    height: 40px;
    padding: 10px;
    width: 80px;
    transition: box-shadow 0.2s ease, background-color 0.2s ease;
    background-color: #fff;
    color: #000;
    outline: none;

    &:hover{
        box-shadow: -2px -3px 89px 5px rgba(229, 255, 0, 0.61);
        transition: box-shadow 0.2s ease, background-color 0.2s ease;
        background-color: rgba(229, 255, 0, 0.61);
    }
`
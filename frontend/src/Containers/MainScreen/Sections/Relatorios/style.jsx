import styled from "styled-components";

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
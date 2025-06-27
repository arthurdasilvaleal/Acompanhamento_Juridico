import styled from "styled-components"

export const Search_box = styled.div`
    display: flex;
    padding: 20px;

    background-color: #525252;
    border: #adadad solid;
    border-top: 0;
    border-left: 0;
    border-right: 0;
    align-items: center;

    input{
        height: 28px;
        background-color: #00000039;
        color: #fff;
        border-radius: .5rem;
        padding: 0 1rem;
        border: 2px solid transparent;
        font-size: 1rem;
        transition: border-color .3s cubic-bezier(.25,.01,.25,1) 0s, color .3s cubic-bezier(.25,.01,.25,1) 0s,background .2s cubic-bezier(.25,.01,.25,1) 0s;
    }

    label{
        font-size: .9rem;
        font-weight: bold;
        width: 150px;
        color: #fff;
        transition: color .3s cubic-bezier(.25,.01,.25,1) 0s;
        text-align: center;
        align-content: center;
    }

    input:hover, input:focus  {
        outline: none;
        border-color: #fff;
    }
`

export const Consult_button = styled.button`
    color: #fff;
    width: 170px;
    height: 48px;
    /* margin-top: 25px; */
    margin-left: auto;
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
`

export const Grid_Box = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 10px;

    .card-Client{
        display: flex;
        flex-direction: column;
        align-items: center;

        padding: 10px;
    }
`
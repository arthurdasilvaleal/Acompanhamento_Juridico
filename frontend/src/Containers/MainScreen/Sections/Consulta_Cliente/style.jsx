import styled from "styled-components"

export const Search_box = styled.div`
    display: flex;
    padding: 20px;

    background-color: #525252;
    border: #adadad solid;
    border-top: 0;
    border-left: 0;
    border-right: 0;

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

export const Grid_Box = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`
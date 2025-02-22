import styled from "styled-components"

export const H_align = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 700px;
`

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid;
    border-radius: 8px;
    padding: 20px 0 20px;
    width: 450px;
`

export const Inputs_box = styled.div`
    .input-container {
        position: relative;
        margin: 20px auto;
        width: 400px;
    }

    .input-container input[type="text"] {
        font-size: 20px;
        width: 100%;
        border: none;
        border-bottom: 2px solid #ccc;
        padding: 5px 0;
        background-color: transparent;
        outline: none;
    }

    .input-container input[type="password"] {
        font-size: 20px;
        width: 100%;
        border: none;
        border-bottom: 2px solid #ccc;
        padding: 5px 0;
        background-color: transparent;
        outline: none;
    }

    .input-container .label {
        position: absolute;
        top: 0;
        left: 0;
        color: #ccc;
        transition: all 0.3s ease;
        pointer-events: none;
    }

    .input-container input[type="text"]:focus ~ .label,
    .input-container input[type="text"]:valid ~ .label {
        top: -20px;
        font-size: 16px;
        color: #333;
    }

    .input-container input[type="password"]:focus ~ .label,
    .input-container input[type="password"]:valid ~ .label {
        top: -20px;
        font-size: 16px;
        color: #333;
    }

    .input-container .underline {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        width: 100%;
        background-color: #333;
        transform: scaleX(0);
        transition: all 0.3s ease;
    }

    .input-container input[type="text"]:focus ~ .underline,
    .input-container input[type="text"]:valid ~ .underline {
        transform: scaleX(1);
    }

    .input-container input[type="password"]:focus ~ .underline,
    .input-container input[type="password"]:valid ~ .underline {
        transform: scaleX(1);
    }
`
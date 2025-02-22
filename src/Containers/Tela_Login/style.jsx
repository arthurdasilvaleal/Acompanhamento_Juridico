import styled from "styled-components";

export const H_align = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 800px;
    gap: 40px;

    img{
      width: 130px;
      border-radius: 20px;
    }
`

export const Container = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid;
    border-radius: 16px;
    overflow: hidden;
    padding: 20px 0 20px;
    width: 450px;

    h1{
        font-size: 24px;
        text-align: center;
    }

    h6{
        
    }

    .btn {
        width: 6.5em;
        height: 2.3em;
        margin: 0.5em;
        background: black;
        color: white;
        border: none;
        border-radius: 0.625em;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        position: relative;
        z-index: 1;
        overflow: hidden;
        transition-property: color;
        transition: 0.3s ease-in-out;
    }

    button:hover {
        color: black;
        transition: 0.3s ease-in-out;
    }

    button:after {
        content: "";
        background: white;
        position: absolute;
        z-index: -1;
        left: -20%;
        right: -20%;
        top: 0;
        bottom: 0;
        transform: skewX(-45deg) scale(0, 1);
        transition: all 0.5s;
    }

    button:hover:after {
        transform: skewX(-45deg) scale(1, 1);
        -webkit-transition: all 0.5s;
        transition: all 0.5s;
    }

    a{
        text-decoration: none;
        color: inherit;
        transition: color 0.2s ease-in-out;
    }

    a:hover{
        transition: color 0.2s ease-in-out;
        color: blue;
    }
`

export const InputSld = styled.div`
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
`
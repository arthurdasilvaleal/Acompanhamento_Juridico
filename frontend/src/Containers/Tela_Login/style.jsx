import styled from "styled-components";

export const Container = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: transparent;
    overflow: hidden;
    box-shadow: 0 0 20px #000;
    color: white;
    /* background-color: #fff; */
    height: 100vh;
    width: 450px;
    backdrop-filter: blur(20px);
    animation: popLeft;
    animation-duration: 1s;
    animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
    @media (max-width: 768px) {
      height: 100dvh; // Arruma a altura do dispositivo
    }

    @keyframes popLeft {
      from{
        transform: translateX(-450px);
      }
      to{
        transform: translateX(0);
      }
    }

    h1{
        font-size: 24px;
        text-align: center;
        padding: 0 10px 0 10px;
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

    .gifs{
      display: flex;
      flex-direction: row;
      gap: 15px;
      img{
        width: 60px;
      }
    }

    p{
      
      margin-top: auto;
    }
`

export const InputSld = styled.div`
  .input-container {
    position: relative;
    margin: 20px auto;
    width: 400px;
    @media (max-width: 560px) {
      width: 70vw;
    }
  }

  .input-container input[type="text"],
  .input-container input[type="password"] {
    font-size: 20px;
    width: 100%;
    border: none;
    border-bottom: 2px solid #8b8b8b;
    padding: 5px 0;
    background-color: transparent;
    outline: none;
    color: #fff;
  }

  .input-container .label {
    position: absolute;
    top: 0;
    left: 0;
    color: #8b8b8b;
    transition: all 0.3s ease;
    pointer-events: none;
  }

  .input-container input[type="text"]:focus ~ .label,
  .input-container input[type="text"]:valid ~ .label,
  .input-container input[type="password"]:focus ~ .label,
  .input-container input[type="password"]:valid ~ .label {
    top: -20px;
    font-size: 16px;
    color: #fff;
  }

  .input-container .underline {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 100%;
    background-color: #fff;
    transform: scaleX(0);
    transition: all 0.3s ease;
  }

  .input-container input[type="text"]:focus ~ .underline,
  .input-container input[type="text"]:valid ~ .underline,
  .input-container input[type="password"]:focus ~ .underline,
  .input-container input[type="password"]:valid ~ .underline {
    transform: scaleX(1);
  }

  //Para deixar o campo valido mesmo quando ele não pode ser submetido
    .input-container.has-text .label{
        top: -20px;
        font-size: 16px;
        color: #fff;
    }

    .input-container.has-text .underline {
        transform: scaleX(1);
    }
`
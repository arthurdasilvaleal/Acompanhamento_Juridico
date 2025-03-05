import styled from "styled-components"

export const H_align = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 910px;
    @media (max-width: 768px) {
      height: 730px;
    }
`

export const Container = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    border: transparent;
    border-radius: 8px;
    padding: 20px 0 20px;
    width: 450px;
    box-shadow: 0 0 20px #000;
    background-color: rgba(255, 255, 255, 1);
    @media (max-width: 768px) {
      width: 88%;
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
`

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding-bottom: 20px;
  @media (max-width: 768px) {
    padding: 0 30px 20px 0;
    justify-content: center;
  }

    h1{
      font-size: 1.7em;
      padding-left: 30px;
      @media (max-width: 768px) {
        padding-left: 5px;
      }
    }

    .styled-wrapper{
      padding-left: 15px;
    }

    .styled-wrapper .button {
      display: block;
      position: relative;
      width: 66px;
      height: 66px;
      margin: 0;
      overflow: hidden;
      outline: none;
      background-color: transparent;
      cursor: pointer;
      border: 0;
    }

    .styled-wrapper .button:before {
      content: "";
      position: absolute;
      border-radius: 50%;
      inset: 7px;
      border: 3.5px solid black; /* Update dynamically for light/dark mode */
      transition:
      opacity 0.4s cubic-bezier(0.77, 0, 0.175, 1) 80ms,
      transform 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) 80ms;
    }

    .styled-wrapper .button:after {
      content: "";
      position: absolute;
      border-radius: 50%;
      inset: 7px;
      border: 4px solid #000;
      transform: scale(1.3);
      transition:
      opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
      transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      opacity: 0;
    }

    .styled-wrapper .button:hover:before,
    .styled-wrapper .button:focus:before {
      opacity: 0;
      transform: scale(0.7);
      transition:
      opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
      transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .styled-wrapper .button:hover:after,
    .styled-wrapper .button:focus:after {
      opacity: 1;
      transform: scale(1);
      transition:
      opacity 0.4s cubic-bezier(0.77, 0, 0.175, 1) 80ms,
      transform 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) 80ms;
    }

    .styled-wrapper .button-box {
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
    }

    .styled-wrapper .button-elem {
      display: block;
      width: 24px;
      height: 24px;
      margin: 22px 18px 0 22px;
      transform: rotate(360deg);
      fill: #f0eeef;
    }

    .styled-wrapper .button:hover .button-box,
    .styled-wrapper .button:focus .button-box {
      transition: 0.4s;
      transform: translateX(-64px);
    }
`

export const Inputs_box = styled.div`
    .input-container {
        position: relative;
        margin: 20px auto;
        width: 400px;
        @media (max-width: 768px) {
          width: 300px;
        }
    }

    .input-container input[type="text"],
    .input-container input[type="password"],
    .input-container input[type="email"] {
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
    .input-container input[type="text"]:valid ~ .label,
    .input-container input[type="password"]:focus ~ .label,
    .input-container input[type="password"]:valid ~ .label,
    .input-container input[type="email"]:focus ~ .label,
    .input-container input[type="email"]:valid ~ .label {
      top: -20px;
      font-size: 16px;
      color: #333;
    }
    
    /* Aplica a cor vermelha quando as senhas forem diferentes */
    .input-container input[data-valido="false"],
    .input-container .label[data-valido="false"] {
      color: red !important; 
    }

    .input-container .underline[data-valido="false"]{
      background-color: red;
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
    .input-container input[type="text"]:valid ~ .underline,
    .input-container input[type="password"]:focus ~ .underline,
    .input-container input[type="password"]:valid ~ .underline,
    .input-container input[type="email"]:focus ~ .underline,
    .input-container input[type="email"]:valid ~ .underline {
        transform: scaleX(1);
    }

    .input-container.has-text .label{
        top: -20px;
        font-size: 16px;
        color: #333;
    }

    .input-container.has-text .underline {
        transform: scaleX(1);
    }
`
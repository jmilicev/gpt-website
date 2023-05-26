import React, { useState } from 'react';
import { call } from './caller.js';
import Image from 'next/image';
import './home.css';

export default function Home() {
    const [inputValue, setInputValue] = useState('');
    const [outputText, setOutputText] = useState('');
  
    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };

    function lockAPIkey(){

        const apikeytag = document.querySelector('.apilock');
        const apiKeyInput = document.querySelector('.api-key-input');

        console.log(apikeytag.textContent);
        if(apikeytag.textContent == "🔒"){
            apiKeyInput.disabled = true;
            apikeytag.textContent = "🔓"
        }else{
            apiKeyInput.disabled = false;
            apiKeyInput.value = ""
            apikeytag.textContent = "🔒"
        }


    }
  
    const handleSendClick = () => {

    const maxTokensInput = document.querySelector('.text-input');
    const apiKeyInput = document.querySelector('.api-key-input');
    const temperatureSlider = document.querySelector('.range-input');

    const maxTokens = parseInt(maxTokensInput.value);
    const apiKey = apiKeyInput.value;
    const temperature = parseFloat(temperatureSlider.value);
    
    call(inputValue, temperature, maxTokens, 'gpt-3.5-turbo','s', apiKey, onDataCallback, onEndCallback);
    
    var response = "";
    function onDataCallback(output) {
        response+=output;
        setOutputText(response);
      }
  
    function onEndCallback() {
        
      }

    };
  
    return (
      <main className="container">
        <h1 className="heading">EnigmaGPT</h1>
  
        <div className="content">
          <div className="section">
            <h2 className="section-heading">Input</h2>
            <section>
              <div className="input-container">
                <textarea
                  className="input-field"
                  placeholder="Enter your text"
                  value={inputValue}
                  onChange={handleInputChange}
                ></textarea>
                <br></br>
                <button className="send-button" onClick={handleSendClick}>Send</button>
              </div>
            </section>
          </div>
  
          <div className="section">
            <h2 className="section-heading">Output</h2>
            <section>
              <div className="output-container">
              <textarea
                  readOnly
                  className="output-field"
                  value={outputText}
                  placeholder="Output will show up here..."
                ></textarea>
              </div>
              <div className="button-group">
                <button className="save-button">Save</button>
                <button className="copy-button">Copy</button>
              </div>
            </section>
          </div>
        </div>
  
        <div className="settings-section">
          <h2 className="section-heading">Settings</h2>
          <div className="settings-container">
            <div className="settings-row">
              <label>Temperature</label>
              <input type="range" min="0" max="1" step="0.05" className="range-input" />
            </div>
            <div className="settings-row">
              <label>Max Tokens</label>
              <input type="text" className="text-input" />
            </div>
            <div className="settings-row">
              <label>OpenAI Key</label>
              <input type="password" className="api-key-input" />
              <button className="apilock" onClick={lockAPIkey}>🔒</button>
              
            </div>

          </div>
        </div>
  
        <footer className="footer">
          <p className="footer-text">Designed and developed by Jovan Milicev</p>
          <div className="social-icons">
            <a href="https://jovanmilicev.com/" target="_blank" rel="noopener noreferrer">
              <img src="/linkedin.svg" alt="Website" width={24} height={24} />
            </a>
            <a href="https://github.com/jmilicev" target="_blank" rel="noopener noreferrer">
              <img src="/github.svg" alt="GitHub" width={24} height={24} />
            </a>
          </div>
        </footer>
      </main>
    );
  }
  

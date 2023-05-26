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

    const saveStringToFile = () => {

        const str = document.querySelector('.output-field').value;
        const filename = "output.txt";
        const blob = new Blob([str], { type: 'text/plain' });

        const url = URL.createObjectURL(blob);
      
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        link.click();

        URL.revokeObjectURL(url);
     };

    function copyToClipboard(){

        const str = document.querySelector('.output-field').value;

        navigator.clipboard.writeText(str)
        .then(() => {
            console.log('Text copied to clipboard');
        })
        .catch((error) => {
            console.error('Error copying text to clipboard:', error);
        });

    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          handleSendClick();
        }
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

        const apiKeyInput = document.querySelector('.api-key-input');
        const apikeytag = document.querySelector('.apilock');

        if(apiKeyInput.value != "" && apikeytag.textContent == "🔓"){
            setOutputText("");
            
            const outputField = document.querySelector('.output-field');
            outputField.placeholder = "Loading ... ";

            const sendButton = document.querySelector('.send-button');
            sendButton.style.backgroundColor = "gray";
            sendButton.disabled = true;
            sendButton.style.cursor = 'not-allowed';


            const maxTokensInput = document.querySelector('.tokens-input');
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
                //restore send button
                const sendButton = document.querySelector('.send-button');
                sendButton.style.backgroundColor = "#007bff";
                sendButton.disabled = false;
                sendButton.style.cursor = 'pointer';
                
                const outputField = document.querySelector('.output-field');
                outputField.placeholder = "Output will show up here ...";
            }
        }else{
            setOutputText("Please check openAI API key\n\nPlease ensure it is entered correctly and locked using the padlock.");
        }
    };
  
    return (
      <main className="container">
        <h1 className="heading">EnigmaGPT</h1>

        <div className="settings-section">
          <div className="settings-container">
            <div className="settings-row">
              <label>Temperature</label>
              <input type="range" min="0" max="1" step="0.05" className="range-input" />
            </div>
            <div className="settings-row">
              <label>Max Tokens</label>
              <input type="text" className="tokens-input" />
            </div>
            <div className="settings-row">
              <label>OpenAI Key</label>
              <input type="password" className="api-key-input" />
              <button className="apilock" onClick={lockAPIkey}>🔒</button>
              
            </div>

          </div>
        </div>
  
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
                onKeyDown={handleKeyDown} // Add this line
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
              <br></br>
              <div className="button-group">
                <button onClick={saveStringToFile} className="save-button">Save</button>
                <button onClick={copyToClipboard} className="copy-button">Copy</button>
              </div>
            </section>
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
  

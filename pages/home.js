import React, { useState } from 'react';
import Image from 'next/image';
import './home.css';

const https = require('https');
const path = require('path');

export default function Home() {
    const [inputValue, setInputValue] = useState('');
    const [outputText, setOutputText] = useState('');

    var [chatlog, setChatLog] = useState('');
  
    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };

    function call(input, temperature, maxTokens, modelType, PARAMETERS, apiKey, onData, onEnd) {
      //check parameters
    
      var abort = false;
      var errorlog =""
      if(input == ""){
        errorlog += ("ERROR: cannot have empty message\n")
        abort = true;
      }if(temperature>1 || temperature<0){
        errorlog += ("ERROR: temperature must be between 0 and 1 inclusive\n");
        abort = true;
      }if(maxTokens<1){
        errorlog += ("ERROR: max tokens cannot be 0 or negative\n");
        abort = true;
      }
    
    
      const options = [
        'gpt-4',
        'gpt-4-0314',
        'gpt-4-32k',
        'gpt-4-32k-0314',
        'gpt-3.5-turbo',
        'gpt-3.5-turbo-0301'
      ];
    
      if(!options.includes(modelType)){
        errorlog += ("ERROR: model is not a valid option");
        errorlog += ("options: gpt-4, gpt-4-0314, gpt-4-32k, gpt-4-32k-0314, gpt-3.5-turbo, gpt-3.5-turbo-0301");
        abort = true;
      }
      
    
      if(!abort){
        var rctoken = 0;
        var trtoken = 0;
    
        var filebuilder = ""
        var potentialErrorString = "";
    
        const startDelimiter = '{"content":"';
        const endDelimiter = '"}';
        const gpt35turbo_RATE = 0.000002; //per 1 token
    
        const req = https.request(
          {
            hostname: "api.openai.com",
            port: 443,
            path: "/v1/chat/completions",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${apiKey}`,
            }
          },
          function (res) {
            let responseData = '';
    
            res.on('data', (chunk) => {
              responseData += chunk.toString();
              potentialErrorString += responseData;
    
              while (responseData.indexOf(startDelimiter) !== -1 && responseData.indexOf(endDelimiter) !== -1) {
                const startIndex = responseData.indexOf(startDelimiter) + startDelimiter.length;
                const endIndex = responseData.indexOf(endDelimiter, startIndex);
    
                if (startIndex !== -1 && endIndex !== -1) {
                  const content = responseData.substring(startIndex, endIndex);
                  const output = content.replace(/\\n/g, '\n');
                  rctoken++;
                  filebuilder+=output;
                  onData(output);
                  responseData = responseData.substring(endIndex + endDelimiter.length);
                } else {
                  break;
                }
              }
            });
    
            res.on('end', () => {
              if (PARAMETERS.includes("e")) {
                onData(" %^& END");
              }
    
              if (PARAMETERS.includes("f")) {
                saveToFile(filebuilder);
              }
    
              const totaltokens = rctoken + trtoken;
              const priceinCENTS = totaltokens * gpt35turbo_RATE * 100;
    
              if (rctoken === 0) {
                const error = "\n\nERROR DETECTED: \nLIKELY API KEY / API ISSUE\n\n" + potentialErrorString + "\n\n\nEND ERROR";
                onData(error);
              } else if (PARAMETERS.includes("a") || PARAMETERS.includes("A")) {
                trtoken = estimateTokenCount(input);
                const analytics = '\n\n -- analytics --\n' +
                  "prompt tokens spent: " + trtoken + '\n' +
                  "completion tokens spent: " + rctoken + '\n' +
                  "total tokens spent: " + totaltokens + '\n' +
                  "estimated cost: ¢" + priceinCENTS.toFixed(3) + '\n' +
                  ' ---- ---- ---- \n';
                onData(analytics);
              } else {
                if (!PARAMETERS.includes("s")) {
                  onData('\n\n ---- ---- ----  ----  ----  ---- \n\n');
                }
              }
    
              onEnd();
            });
          }
        );
    
        req.on('error', (e) => {
          console.error("Problem with request" + e);
        });
    
        function estimateTokenCount(text) {
          //according to OpenAI, each token is approximately 4 characters
          return Math.round(text.length / 4);
        }
    
        function processCall() {
          var body = JSON.stringify({
            messages: [
              {
                role: 'user',
                content: input,
              },
            ],
            model: modelType,
            temperature: temperature,
            max_tokens: maxTokens,
            stream: true
          });
    
          if (!PARAMETERS.includes("s")) {
            onData("\n -- GPT: --\n");
            onData("temp = " + temperature + " | m-t = " + maxTokens + " | mdl = " + modelType + "\n\n");
          }
          req.write(body);
          req.end();
        }
    
        processCall();
        }else{
          onEnd(" -- INVALID PARAMETERS | "+errorlog);
          onData(" -- INVALID PARAMETERS | "+errorlog);
    
          
        }
    }
    

    function clearChatLogs(){
        setChatLog("");
    }

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
            
            setChatLog(chatlog+= "\n\nME: "+inputValue+"\n\n")

            const maxTokensInput = document.querySelector('.tokens-input');
            const temperatureSlider = document.querySelector('.range-input');

            const maxTokens = parseInt(maxTokensInput.value);
            const apiKey = apiKeyInput.value;
            const temperature = parseFloat(temperatureSlider.value);
            console.log("top"+chatlog);

            call(inputValue, temperature, maxTokens, 'gpt-3.5-turbo','s', apiKey, onDataCallback, onEndCallback);
            
            
            
            var response = "";
            var clog = chatlog + "GPT: ";
            var chunkCharLength;
            function onDataCallback(output) {
                response+=output;
                clog+=output;
                setOutputText(response);
                setChatLog(clog + output);
            }
        
            function onEndCallback() {
               //setChatLog(chatlog+"\n\n");

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
              <label>Creativity</label>
              <input type="range" min="0" max="1" step="0.05" className="range-input" />
            </div>
            <div className="settings-row">
              <label>Max Tokens</label>
              <input pattern="[0-9]*"
                onKeyPress={(event) => {
                    const charCode = event.which ? event.which : event.keyCode;
                    if (charCode !== 8 && charCode !== 0 && charCode < 48 || charCode > 57) {
                    event.preventDefault();
                    }
                }}
                type="text" 
                className="tokens-input" />
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
                <button onClick={clearChatLogs} className="clear-logs-button">Clear Logs</button>
                <button onClick={copyToClipboard} className="copy-button">Copy</button>
                
              </div>
            </section>
          </div>
        </div>

        <div className='chatlogcontainer'>
            <h2>Chat</h2>
        <textarea
            readOnly
            className="chatlog"
            value={chatlog}
            placeholder="chatlog..."
        ></textarea>

        </div>
  
        <footer className="footer">
          <p className="footer-text">Designed and developed by Jovan Milicev</p>
          <div className="social-icons">
            <a href="http://in.jovanmilicev.com/" target="_blank" rel="noopener noreferrer">
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
  

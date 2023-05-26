const https = require('https');
const path = require('path');

function saveToFile(data, name) {

  // not supported for react/next.js

}

function callAPI(input, temperature, maxTokens, modelType, PARAMETERS, apiKey, onData, onEnd) {
  //check parameters

  var abort = false;
  if(input == ""){
    console.log("ERROR: cannot have empty message")
    abort = true;
  }if(temperature>1 || temperature<0){
    console.log("ERROR: temperature must be between 0 and 1 inclusive");
    abort = true;
  }if(maxTokens<1){
    console.log("ERROR: max tokens cannot be 0 or negative");
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
    console.log("ERROR: model is not a valid option");
    console.log("options: gpt-4, gpt-4-0314, gpt-4-32k, gpt-4-32k-0314, gpt-3.5-turbo, gpt-3.5-turbo-0301");
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
      onEnd(" -- ERROR, INVALID PARAMETERS");
      onData(" -- ERROR, INVALID PARAMETERS");
    }
}

module.exports = {
  call: callAPI
};

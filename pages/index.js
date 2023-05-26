import React, { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [outputText, setOutputText] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendClick = () => {
    setOutputText(inputValue);
  };

  return (
    <main className="flex flex-col items-center justify-between p-24 bg-white">
      <h1 className="text-4xl font-bold mb-8 text-center text-black my-0 pt-12 border-b-2 border-gray-200">QuerusGPT</h1>

      <div className="flex w-full justify-between">
        <div className="w-1/2 pr-4">
          <h2 className="text-2xl font-bold mb-4 text-black">Input</h2>
          <section className="mb-8">
            <div className="flex items-center flex-col mb-4">
              <textarea
                className="w-full h-32 px-4 py-2 border border-gray-300 rounded bg-white text-black"
                placeholder="Enter your text"
                value={inputValue}
                onChange={handleInputChange}
              />
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSendClick}
              >
                Send
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-black">Output</h2>

            <div className="w-full h-48 bg-gray-100 border border-gray-300 rounded p-4 overflow-y-auto">
              {outputText}
            </div>

            <div className="flex justify-center mt-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mx-2">Save</button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mx-2">Copy</button>
            </div>
          </section>
        </div>

        <section className="w-1/2 pl-4">
          <h2 className="text-xl font-bold mb-4 text-black">Settings</h2>

          <div className="flex items-center mb-4">
            <label className="mr-4 text-black">Temperature</label>
            <input type="range" min="0" max="1" step="0.05" className="w-1/2 bg-white" />
          </div>

          <div className="flex items-center mb-4">
            <label className="mr-4 text-black">Max Tokens</label>
            <input type="text" className="w-1/2 px-4 py-2 border border-gray-300 rounded bg-white text-black" />
          </div>

          <div className="flex items-center mb-4">
            <label className="mr-4 text-black">OpenAI Key</label>
            <input type="password" className="w-1/2 px-4 py-2 border border-gray-300 rounded bg-white text-black" />
          </div>
        </section>
      </div>

      <br />
      {/* Footer */}
      <footer className="w-full py-4 bg-gray-200 text-gray-600 text-center">
        <p className="text-sm">Designed and developed by Jovan Milicev</p>
        <div className="flex justify-center mt-2">
          <a href="https://jovanmilicev.com/" target="_blank" rel="noopener noreferrer" className="mx-2">
            <Image src="/linkedin.svg" alt="Website" width={24} height={24} />
          </a>
          <a href="https://github.com/jmilicev" target="_blank" rel="noopener noreferrer" className="mx-2">
            <Image src="/github.svg" alt="GitHub" width={24} height={24} />
          </a>
        </div>
      </footer>
    </main>
  );
}

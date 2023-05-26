import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
      <h1 className="text-4xl font-bold mb-8 text-center text-black">Querus-GPT</h1>

      <div className="flex w-full justify-between">
        <div className="w-1/2 pr-4">
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <textarea className="w-full h-32 px-4 py-2 border border-gray-300 rounded bg-white text-black" placeholder="Enter your text" />
            </div>

            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Send</button>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-black">Output</h2>

            <div className="w-full h-48 bg-gray-100 border border-gray-300 rounded p-4 overflow-y-auto">
              {/* Output text will be displayed here */}
            </div>
          </section>
        </div>

        <section className="w-1/2 pl-4">
          <h2 className="text-xl font-bold mb-4 text-black">Settings</h2>

          <div className="flex items-center mb-4">
            <label className="mr-4 text-black">Temperature:</label>
            <input type="range" min="0" max="1" step="0.1" className="w-1/2 bg-white" />
          </div>

          <div className="flex items-center mb-4">
            <label className="mr-4 text-black">Max Tokens</label>
            <input type="text" className="w-1/2 px-4 py-2 border border-gray-300 rounded bg-white text-black" />
          </div>

          <div className="flex items-center mb-4">
            <label className="mr-4 text-black">Parameters</label>
            <input type="text" className="w-1/2 px-4 py-2 border border-gray-300 rounded bg-white text-black" />
          </div>
        </section>
      </div>
    </main>
  );
}

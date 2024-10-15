export default function Home() {
  return (
    <main className="h-screen bg-gradient-to-b from-blue-500 to-black flex items-center justify-center">
      <h1 className="text-white text-4xl font-bold">MUSIC.IA</h1>

      <div className="flex items-center justify-center mb-6">
            <span className="text-lg mr-2">Quiero escuchar algo como:</span>
            <input

              type="text"
              name="inputbox"
              placeholder=""
              className="bg-transparent border-b-2 border-white focus:border-yellow-300 focus:outline-none placeholder:text-gray-300 px-2 py-1"
            />
            <input
              type="hidden"
              name="prompt"
              id="prompt"
            />
            <button
              type="submit"
              className="ml-4 bg-yellow-400 text-blue-900 font-bold py-2 px-4 rounded hover:bg-yellow-300 transition duration-300"
            >
              Suggest
            </button>
          </div>
    </main>
  );
}

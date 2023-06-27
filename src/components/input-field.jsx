
const InputField = ({handleSubmit, onChange, isLoading, url, showResult}) => {
  return (

    <div>
      <div className="text-center p-10 text-4xl tracking-widest font-bold text-gray-700 animate-pulse">Insight</div>
        <form onSubmit={handleSubmit} className="w-fit flex justify-center items-center">
        <div className="flex items-center h-10 w-full md:w-[600px] bg-white">
          <input
            type="text"
            placeholder="Quick add a URL"
            value={url}
            onChange={onChange}
            className="h-full w-full py-1 px-4 bg-transparent border border-solid border-gray-300 text-gray-700 rounded-tl-md rounded-bl-md leading-tight outline-gray-700"
          />
          <button
            type="submit"
            className={`-mx-1 w-[150px] h-full bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-tr-md rounded-br-md  ${isLoading ? 'cursor-wait bg-blue-300 hover:bg-blue-300' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default InputField
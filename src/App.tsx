import { useEffect, useState } from "react";

import { FaMoon, FaSun } from "react-icons/fa";

import axios from "axios";

const App = () => {

  const [darkMode, setDarkMode] = useState<boolean>(() => { return window.matchMedia("(prefers-color-scheme: dark)").matches; });

  const toggle = () => { setDarkMode(!darkMode), localStorage.setItem("darkMode", String(!darkMode)); };

  useEffect(() => {
    if (localStorage.getItem("darkMode") !== null) setDarkMode(localStorage.getItem("darkMode") === "true");
  }, []);

  type Data = { url: string }
  const object: Data = { url: "" }
  const [data, setData] = useState<Data>(object);
  const [error, setError] = useState<Data>(object);
  const [shortened, setShortened] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError({
      url: ""
    })
    setData({
      url: event.target.value
    })
  }

  const [requesting, setRequesting] = useState<boolean>(false);
  const [successful, setSuccessful] = useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(), setRequesting(true);

    axios.post(`${import.meta.env.VITE_API}/shorten`, data)
      .then((response) => { setShortened(response.data.shortened), setSuccessful(true) })
      .catch((error) => {
        const errorData = error.response.data;
        if (Array.isArray(errorData)) {
          errorData.forEach(index => {
            setError(error => ({
              ...error,
              [index.field]: index.message
            }))
          })
        }
      })
      .finally(() => { setRequesting(false) })

  }

  const [coppied, setCoppied] = useState<boolean>(false);
  const copy = () => {
    setCoppied(true), setTimeout(() => {
      setCoppied(false);
    }, 500);
  }

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      {darkMode ?
        <div onClick={toggle} className="cursor-pointer absolute top-5 max-[640px]:top-auto max-[640px]:bottom-5 left-5 w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-center text-black text-3xl"><FaSun /></div>
        :
        <div onClick={toggle} className="cursor-pointer absolute top-5 max-[640px]:top-auto max-[640px]:bottom-5 left-5 w-14 h-14 rounded-full bg-neutral-900 flex items-center justify-center text-center text-white text-3xl"><FaMoon /></div>
      }
      <div className="bg-stone-100 dark:bg-neutral-900 lg:h-lvh sm:h-svh max-[640px]:h-svh">
        <div className="flex flex-col items-center py-5 cursor-default select-none">
          <h1 className="text-5xl text-sky-500 border-b border-sky-500 font-semibold">Confia, pô!</h1>
          <p className="text-base text-neutral-600 dark:text-neutral-300 font-semibold text-center">eu ia mentir pra quê?</p>
        </div>
        <div className="max-w-3xl w-full h-40 p-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {!requesting && !successful &&
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl text-neutral-600 dark:text-neutral-300">Encurte seu link:</h2>
              <form onSubmit={handleSubmit} className="flex justify-between gap-4">
                <input type="text" placeholder="https://lucasadm.onrender.com" value={data.url} onChange={handleChange} required className="text-xl dark:text-neutral-400 p-3 border dark:bg-neutral-800 placeholder-neutral-400 focus:placeholder-white dark:placeholder-neutral-600 dark:focus:placeholder-neutral-800 border-neutral-300 rounded focus:outline-none focus:border-sky-500 w-full" />
                <button className="p-3 bg-sky-400 border-2 border-blue-400 text-xl text-white font-medium rounded active:relative active:top-1 hover:saturate-200">Encurtar</button>
              </form>
              <p className="text-xl text-red-400">{error.url}</p>
            </div>
          }
          {requesting &&
            <div className="min-h-full min-w-full flex flex-center p-4 justify-center items-center gap-2 bg-white dark:bg-neutral-800 border-l-8 border-sky-500 rounded shadow-md">
              <h2 className="text-3xl text-neutral-600 dark:text-neutral-300">Seu link está sendo encurtado</h2>
              <img src="loading.svg" alt="ícone de carregamento" className="select-none w-8 h-8 self-end mb-6 max-[508px]:mb-2" />
            </div>
          }
          {successful &&
            <div className="min-h-full min-w-full flex items-center justify-center gap-4 p-4 bg-white dark:bg-neutral-800 border-l-8 border-sky-500 rounded shadow-md">
              <div className="min-w-full flex items-center justify-between gap-4">
                <input type="text" readOnly value={shortened.replace("https://", "")} className={`text-xl dark:text-neutral-400 p-3 ${coppied ? "dark:text-neutral-800 bg-emerald-200 border-emerald-400" : "bg-stone-100 dark:bg-neutral-800 border-neutral-300"} border rounded focus:outline-none w-full`} />
                <button onClick={() => { navigator.clipboard.writeText(shortened), copy() }} className="outline-emerald-600 p-3 bg-emerald-400 border-2 border-green-400 text-xl text-white font-medium rounded active:relative active:top-1 hover:saturate-150">Copiar</button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default App
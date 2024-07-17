import { useEffect, useState } from "react";

import { FaMoon, FaSun } from "react-icons/fa";

import axios from "axios";

const App = () => {

  const [darkMode, setDarkMode] = useState<boolean>(() => { return window.matchMedia("(prefers-color-scheme: dark)").matches; });

  const toggle = () => { setDarkMode(!darkMode), localStorage.setItem("darkMode", String(!darkMode)); };

  type Analytics = {
    totalVisitorCount: number,
    totalLinkCount: number,
    monthlyVisitorCount: number,
    monthlyLinkCount: number,
    dailyVisitorCount: number,
    dailyLinkCount: number
  }

  const [analytics, setAnalytics] = useState<Analytics>({
    "totalVisitorCount": 0,
    "totalLinkCount": 0,
    "monthlyVisitorCount": 0,
    "monthlyLinkCount": 0,
    "dailyVisitorCount": 0,
    "dailyLinkCount": 0
  });

  useEffect(() => {
    if (localStorage.getItem("darkMode") !== null) setDarkMode(localStorage.getItem("darkMode") === "true");
    axios.get(`${import.meta.env.VITE_API}/analytics`)
      .then(response => setAnalytics(response.data))
      .catch(() => { return })
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
    <div className={`${darkMode ? "dark" : ""} relative`}>
      {darkMode ?
        <div onClick={toggle} tabIndex={1} onKeyDown={(event: React.KeyboardEvent) => event.key === "Enter" ? toggle() : ""} className="cursor-pointer absolute top-8 left-5 w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-center"><FaSun className="text-3xl text-indigo-600" /></div>
        :
        <div onClick={toggle} tabIndex={1} onKeyDown={(event: React.KeyboardEvent) => event.key === "Enter" ? toggle() : ""} className="cursor-pointer absolute top-8 left-5 w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center text-center"><FaMoon className="text-3xl text-indigo-600" /></div>
      }
      <div className="bg-stone-100 dark:bg-neutral-900 lg:min-h-lvh sm:min-h-svh max-[640px]:min-h-svh flex flex-col items-center justify-between gap-8 lg:pb-32 py-8">
        <div className="flex flex-col items-center cursor-default select-none">
          <h1 className="text-5xl text-indigo-500 border-b border-indigo-500 font-semibold">XISYZ</h1>
          <p className="text-base text-neutral-600 dark:text-neutral-300 font-semibold text-center">xyz</p>
        </div>
        <div className="max-w-3xl w-full max-[640px]:max-w-md min-h-40 p-4">
          {!requesting && !successful &&
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl text-neutral-600 dark:text-neutral-300 font-comfortaa">Encurta seu link:</h2>
              <form onSubmit={handleSubmit} className="flex justify-between gap-4 max-[640px]:flex-col max-[640px]:gap-8">
                <input type="text" placeholder="https://" value={data.url} onChange={handleChange} required className="text-xl dark:text-neutral-400 p-3 border dark:bg-neutral-800 placeholder-neutral-400 focus:placeholder-white dark:placeholder-neutral-600 dark:focus:placeholder-neutral-800 border-neutral-300 rounded focus:outline-none focus:border-indigo-500 w-full" />
                <button className="p-3 bg-indigo-500 border-2 border-indigo-400 text-xl text-white font-medium rounded active:relative active:top-1 hover:saturate-200">Encurtar</button>
              </form>
              <p className="text-xl text-red-400">{error.url}</p>
            </div>
          }
          {requesting &&
            <div className="min-h-full min-w-full flex flex-center p-4 justify-center items-center gap-2 bg-white dark:bg-neutral-800 border-l-8 border-indigo-500 rounded shadow-md">
              <h2 className="text-3xl text-neutral-600 dark:text-neutral-300 text-center font-comfortaa">Seu link está sendo encurtado</h2>
              <img src="/svgs/loading.svg" alt="ícone de carregamento" className="select-none w-8 h-8 mt-2.5 max-[586px]:self-end" />
            </div>
          }
          {successful &&
            <div className="min-h-full min-w-full flex items-center justify-center gap-4 p-4 bg-white dark:bg-neutral-800 border-l-8 border-indigo-500 rounded shadow-md">
              <div className="min-w-full flex items-center justify-between gap-4 max-[640px]:flex-col max-[640px]:gap-8">
                <input type="text" readOnly value={shortened.replace("https://", "")} className={`text-xl dark:text-neutral-400 p-3 ${coppied ? "dark:text-neutral-800 bg-emerald-200 border-emerald-400" : "bg-stone-100 dark:bg-neutral-800 border-neutral-300"} border rounded focus:outline-none w-full`} />
                <button onClick={() => { navigator.clipboard.writeText(shortened.replace("https://", "")), copy() }} className="outline-emerald-600 p-3 bg-emerald-400 border-2 border-green-400 text-xl text-white font-medium rounded active:relative active:top-1 hover:saturate-150 max-[640px]:w-full">Copiar</button>
              </div>
            </div>
          }
        </div>
        <div className="max-w-7xl w-full max-[640px]:max-w-sm grid grid-cols-3 max-[640px]:grid-cols-1 items-center gap-12 max-[640px]:gap-4 px-8">
          <div className="flex flex-col items-center gap-4 px-2 py-4 bg-white dark:bg-neutral-800 border-l-8 border-indigo-500 rounded shadow-md">
            <div>
              <h2 className="text-neutral-600 dark:text-neutral-100 font-semibold">TOTAL</h2>
            </div>
            <div className="w-full flex items-center justify-around gap-4">
              <div className="text-center">
                <h3 className="text-xl text-neutral-600 dark:text-neutral-100">{analytics?.totalLinkCount}</h3>
                <p className="text-base text-neutral-600 dark:text-neutral-100">Links</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl text-neutral-600 dark:text-neutral-100">{analytics?.totalVisitorCount}</h3>
                <p className="text-base text-neutral-600 dark:text-neutral-100">Visitas</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 px-2 py-4 bg-white dark:bg-neutral-800 border-l-8 border-indigo-500 rounded shadow-md">
            <div>
              <h2 className="text-neutral-600 dark:text-neutral-100 font-semibold">ESTE MÊS</h2>
            </div>
            <div className="w-full flex items-center justify-around gap-4">
              <div className="text-center">
                <h3 className="text-xl text-neutral-600 dark:text-neutral-100">{analytics?.monthlyLinkCount}</h3>
                <p className="text-base text-neutral-600 dark:text-neutral-100">Links</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl text-neutral-600 dark:text-neutral-100">{analytics?.monthlyVisitorCount}</h3>
                <p className="text-base text-neutral-600 dark:text-neutral-100">Visitas</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 px-2 py-4 bg-white dark:bg-neutral-800 border-l-8 border-indigo-500 rounded shadow-md">
            <div>
              <h2 className="text-neutral-600 dark:text-neutral-100 font-semibold">HOJE</h2>
            </div>
            <div className="w-full flex items-center justify-around gap-4">
              <div className="text-center">
                <h3 className="text-xl text-neutral-600 dark:text-neutral-100">{analytics?.dailyLinkCount}</h3>
                <p className="text-base text-neutral-600 dark:text-neutral-100">Links</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl text-neutral-600 dark:text-neutral-100">{analytics?.dailyVisitorCount}</h3>
                <p className="text-base text-neutral-600 dark:text-neutral-100">Visitas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
import { useState } from "react";

import axios from "axios";

const App = () => {

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

  return (
    <>
      <div className="container">
        <div className="header">
          <h1>Confia, pô!</h1>
          <p>cê ia mentir pra quê?</p>
        </div>
        <div className="main">
          {!requesting && !successful &&
            <div className="shorten">
              <h2>Encurte seu link:</h2>
              <form onSubmit={handleSubmit}>
                <input type="text" value={data.url} onChange={handleChange} required />
                <button>Encurtar</button>
              </form>
              <p>{error.url}</p>
            </div>
          }
          {requesting &&
            <div className="requesting">
              <h2>Sue link está sendo encurtado</h2>
            </div>
          }
          {successful &&
            <div className="response">
              <h3>{shortened}</h3>
              <button onClick={() => navigator.clipboard.writeText(shortened)}>Copiar</button>
            </div>
          }
        </div>
      </div>
    </>
  )
}

export default App
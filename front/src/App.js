import {useState, useRef } from 'react'


function App() {
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [error, setErrorText] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState(null);

  const refEmail = useRef(null)

  const num = number.toString().match(/\d{1,2}/g)?.join("-");

  const bad = {
    color: "red",
  }

  const setError = (message, ref = null, delay = 1) => {
    setErrorText(message);
    
    if(ref) {
      ref.current.style.borderColor = "red";
    }
    setTimeout(() => {
      setErrorText("");
      if(ref) {
        ref.current.style.borderColor = "";
      }
    }, 1000 * delay);
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const request = (e) => {
    e.preventDefault();
    if(email.length <= 0) {
      setError("Email is required", refEmail);
      return;
    } else if(!validateEmail(email)) {
      setError("Email is bad", refEmail);
      return;
    }
    setStatus("Pending");
    fetch("http://localhost:8080/search", {
      method: "POST",
      body: JSON.stringify({
        email,
        number,
      }),
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    }).then(response => response.json()).then(json => {
      setStatus("");
      if(json.ok === 1) {
        setData(json.data);
      } else {
       
        setError(json.error);
      }
     
    }).catch(err => {
      setStatus("Network error");
      setData([]);
      setError(err);
    });
    console.log("email", email);
    console.log("number", number);
  }

  return (
    <>
      <form>
      <input type="text" placeholder="email" ref={refEmail} onChange={(e) => {
        setEmail(e.target.value);
      }} value={email} required />
      <input  type="text" placeholder="number" onChange={(e) => {
        setNumber(e.target.value);
      }} value={num} required />
      <input type="submit" disabled={status === "Pending"} value="search" onClick={request} />
        {error && <p style={bad}>{error}</p>}
      </form>
      {status && <p>Status: {status} </p> }
      {data && 
      <>
      
      {data.length <= 0 ? 
      <p>not found:</p> : <p>found:</p>}
      
      {data.length > 0 && data.map(e => {
        return <p>Email: {e.email}, number: {e.number}</p>
      })}
      </>}
    </>
  );
}

export default App;

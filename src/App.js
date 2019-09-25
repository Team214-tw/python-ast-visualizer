import React, { useRef, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import './App.css';
import './vtree.css';

const visualize = debounce((code, vt) => {
  fetch("https://pi.tsengcy.nctu.me/api",
    { body: code, method: 'POST' })
    .then(res => res.json())
    .then(res => {
      if (!vt) return;
      vt.mode(vt.MODE_PYTHON_AST)
        .data(res)
        .conf('showArrayNode', false)
        .update();
    });
}, 250);


function App() {
  const ref = useRef(null);
  const [vt, setVt] = useState();
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!ref.current) return;
    setVt(window.vtree(ref.current));
  }, [ref])

  const handleCodeChange = e => {
    setCode(e.target.value);
    visualize(e.target.value, vt);
  }

  return (
    <div className="App">
      <textarea className="TextArea" value={code} onChange={handleCodeChange} />
      <div className="Graph" ref={ref} />
    </div>
  );
}

export default App;

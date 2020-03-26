import React, { useRef, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import AceEditor from 'react-ace';
import './App.css';
import './vtree.css';

import 'brace/mode/python';
import 'brace/theme/tomorrow';
import 'brace/snippets/python';
import 'brace/ext/language_tools';

const visualize = debounce((code, vt) => {
  fetch("/api",
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

  const handleCodeChange = val => {
    setCode(val);
    visualize(val, vt);
  }

  return (
    <div className="App">
      <div className="Code">
        <AceEditor
          mode="python"
          theme="tomorrow"
          onChange={handleCodeChange}
          fontSize={14}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          value={code}
          height="100%"
          width="100%"
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 4,
          }} />
      </div>
      <div className="Graph" ref={ref} />
    </div>
  );
}

export default App;

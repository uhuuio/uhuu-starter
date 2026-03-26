import { useState, useEffect } from 'react';
import { Template } from './template/Template';
import sampleData from './../test/sample_data.json';

var defaultData = import.meta.env.DEV ? sampleData : null;

$uhuu.templateSetup({});

function App() {
  const [payload, setPayload] = useState($uhuu.payload() || defaultData);

  useEffect(() => $uhuu.listen('payload', (data) => setPayload(data)), []);

  if (!payload) return <></>;

  return <Template payload={payload} onPayloadChange={setPayload} />;
}

export default App;

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Template } from './template/Template'
import { Dynamic } from 'uhuu-components';
const { Pagination } = Dynamic;
import printCssRaw from './print.css?raw';

// Setup uhuuu editor behaviours for template
import TemplateSetup from './template/TemplateSetup.js'
TemplateSetup();

// Define sample data for local development
import sampleData from './test/sample_data.json'

// use sample data for local development.
var defaultData = import.meta.env.DEV ? sampleData : null;

// Do something after payload update.
function App() {

  // Initialize payload state to hold $uhuu payload changes
  const [payload, setPayload] = useState( $uhuu.payload() || $uhuu.restore.handle(defaultData) );

  // Listen $uhuu SDK events and update payload state to recent one.
  $uhuu.listen('payload', (data) => setPayload(data));
  
  // localization
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // check language change.
    if(['en', 'de'].includes(payload?.language))
      i18n.changeLanguage(payload?.language);

  }, [payload]);

  if(!payload) return <></>;

  return (
    <Pagination setup={{ format: "A4", printCssRaw }}>
        <Template payload={payload} />
    </Pagination>
  );
}

export default App

import React from 'react';
import { EditorShell } from 'uhuu-components';
const { InteractiveModeProvider, TemplateDataProvider, PageEditor } = EditorShell;

import { InvoicePage } from './Page';
import { THEMES } from '../themes';

const isDev = import.meta.env.DEV;

const templateConfig = {
  pages: {
    invoice: { label: 'Invoice', component: InvoicePage },
  },
  initial: ['invoice'],
};

const pageOptions = [
  {
    id: 'theme',
    label: 'Theme',
    type: 'color-series',
    options: Object.entries(THEMES).map(([value, t]) => ({
      value,
      label: t.label,
      hex: t.primary,
    })),
  },
];

function TemplateContent() {
  return (
    <PageEditor
      templateConfig={templateConfig}
      pageFormat={{ width: 210, height: 297 }}
      pageOptions={pageOptions}
    />
  );
}

export function Template({ payload, onPayloadChange }) {
  return (
    <InteractiveModeProvider defaultInteractive={true} enableDevTools={isDev}>
      <TemplateDataProvider payload={payload} onPayloadChange={onPayloadChange}>
        <TemplateContent />
      </TemplateDataProvider>
    </InteractiveModeProvider>
  );
}

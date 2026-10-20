import React from 'react';
import { ImageBlock, Editing } from 'uhuu-components';

export function Page({payload}) {  
  const { title, message, url } = payload
  return (
    <div className="p-6 mx-6">
      <Editing.Editable dialog={{ path: 'title' }}>
        <div className="font-bold text-4xl mt-9">{title}</div>
      </Editing.Editable>

      <Editing.Editable dialog={{ path: 'message', rows: 5, panelSize: '3xl' }}>
        <div className="text-base mt-9">{message}</div>
      </Editing.Editable>

      <ImageBlock
        mode="bleed"
        src={url}
        top={100}
        bottom={10}
        right={0}
        left={10}
        dialog={{
          path: 'url',
          type: 'image',
          ratio: 1
        }}
      />
    </div>
  );
}

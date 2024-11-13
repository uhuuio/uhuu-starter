import React from 'react';

export function Page({ payload }) {
  const {title,message, url} = payload ?? {};

  return (
    <div className="A4 bg-white">
      <div className="p-6 mx-6">
        <div className="font-bold text-4xl mt-9" data-uhuu onClick={() => $uhuu.editDialog({path:'title'}) }>{title}</div>        
        <div className="text-base mt-9" data-uhuu onClick={() => $uhuu.editDialog({path:'message', rows: 5, panelSize: '3xl'}) }>{message}</div>        
        <div className="aspect-square mt-9 max-w-sm mx-auto" data-uhuu onClick={()=>$uhuu.editDialog({path: 'url', type:'image', ratio: 1})}>
            <img src={url} className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}

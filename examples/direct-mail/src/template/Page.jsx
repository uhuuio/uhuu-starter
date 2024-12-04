import React from 'react';
import {QRCodeSVG} from 'qrcode.react';
import Markdown from 'react-markdown';
import dayjs from 'dayjs';
import { UserSchema } from './../../test/schema';

export function Page({ payload }) {
  // Fields from the payload for readability
  const {
    id,
    company,
    first_name,
    last_name,
    city,
    street_address,
    postal_code
  } = payload.user ?? {};

  // Generate the event date two weeks from now if not provided
  const eventDate = payload.event_date || dayjs().add(2, 'week').hour(10).minute(0).format('MMMM D, YYYY, [at] h:mm A');

  // Load the template from JSON and replace placeholders with actual data
  const populatedMarkdown = (payload.message || '')
    .replace('{name}', `${first_name} ${last_name}`)
    .replace('{eventDate}', eventDate);

  return (
    <div>
      <div className="p-6 mx-6">
        {/* Header with company information */}
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-600">
            <p>Uhuu AG, Klosbachstrasse 134</p>
            <p>8032 Zurich, mail@uhuu.io</p>
          </div>
          <div className="text-right">
            <a href="https://uhuu.io" target="_blank" rel="noopener noreferrer">
              <img className="w-36" alt="uhuu.io" src="https://platform.uhuu.io/common/brand/logos/uhuu_logo.svg" />
            </a>
          </div>
        </div>

        {/* Recipient Details */}
        <div className="mt-10 text-sm inline-block pr-6" data-uhuu onClick={() => $uhuu.editDialog({ path: 'user', type: 'schemaform', schema: UserSchema })}>
          <p>Personal Invitation</p>
          <p>Dear {first_name} {last_name}</p>
          <p>{company}</p>
          <p>{street_address}</p>
          <p>{city}, {postal_code}</p>
        </div>

        {/* Date and Title */}
        <div className="mt-8 text-sm">
          <div className="inline-block pr-6" data-uhuu onClick={() => $uhuu.editDialog({ path: 'event_date' })}>{eventDate}</div>
          <div className="mt-6 text-xl font-bold">Automated documents with Uhuu</div>
        </div>

        {/* Message Body */}
        <div data-uhuu onClick={() => $uhuu.editDialog({ path: 'message', type: 'markdown' })} className="mt-6 text-sm leading-relaxed whitespace-prewrap prose w-full max-w-none text-black">
          <Markdown>{populatedMarkdown}</Markdown>
        </div>

        {/* Footer with signatures */}
        <div className="flex justify-between items-center mt-10">
          <div className="text-center">
            <p className="font-bold">Luca Meier</p>
            <p>Uhuu Workshop Lead</p>
          </div>
          <div className="text-center">
            <p className="font-bold">Sophie Baumann</p>
            <p>Uhuu Product Specialist</p>
          </div>
        </div>

        {/* Call-to-action */}
        <div className="text-sm text-right border-t flex justify-end items-center absolute bottom-0 right-0 left-0 px-6 py-3">
          <div className="max-w-64 mr-6">Scan the QR code below to register directly for the Uhuu Workshop.</div>
          <span data-uhuu onClick={() => $uhuu.editDialog({ path: 'qr_url' })}>
            <QRCodeSVG className="relative bg-white p-2 h-full" fgColor="#1A1919" bgColor="#fff" value={payload.qr_url} />
          </span>
        </div>
      </div>
    </div>
  );
}
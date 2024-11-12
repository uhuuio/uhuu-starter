import React, { Fragment, useEffect } from 'react';
import nl2br from '@/utility/nl2br'
import currency from 'currency.js';
import { useTranslation } from 'react-i18next';

export default function ({ payload }) {

  const listing = payload.listing;
  const { t, i18n } = useTranslation();

  let features = [
      ["detail", "pba__address_pb__c"],
      ["general", "wp_areagerman__c"],
      ["marketing", "wp_textinternetgerman__c"],
      ["general", "pba_dachfields__rooms__c"],
      ["general", "pba__bedrooms_pb__c"],
      ["general", "pba__lotsize_pb__c"],
      ["general", "pba_dachfields__living_space_sqm__c"],
      ["general", "wp_ancillaryroomsqm__c"],
      ["general", "wp_specialsinternetgerman__c"],
      ["general", "wp_moveindategerman__c"],
      ["general", "wp_parkinginternetgerman__c"],
      ["general", "pba__yearbuilt_pb__c"]
  ];

  if(i18n.language == "en") {
      features = [
          ["detail", "pba__address_pb__c"],
          ["general", "wp_areaenglish__c", "wp_areagerman__c"],
          ["marketing", "wp_textinternetenglish__c", "wp_textinternetgerman__c"],
          ["general", "pba_dachfields__rooms__c"],
          ["general", "pba__bedrooms_pb__c"],
          ["general", "pba__lotsize_pb__c"],
          ["general", "pba_dachfields__living_space_sqm__c"],
          ["general", "wp_ancillaryroomsqm__c"],
          ["general", "wp_specialsinternetenglish__c", "wp_specialsinternetgerman__c"],
          ["general", "wp_moveindateenglish__c", "wp_moveindategerman__c"],
          ["general", "wp_parkinginternetenglish__c", "wp_parkinginternetgerman__c"],
          ["general", "pba__yearbuilt_pb__c"]
      ];
  }

  const priceFormat = () => {
    let price = listing.price.pba__listingprice_pb__c;
    if(isNaN(price )) return price; 
    return currency( price, { separator: "'", symbol: '', precision: 0 }).format();
  }

  return (

      <div className="divide-y text-sm">

        {
          features.map((feature, index) => {
            if(!listing[feature[0]][feature[1]]) return null;

            let name = listing[feature[0]][feature[1]];
            let html = typeof(name) === 'string' ?  name.replace(/\n/g, "<br />") : name;
            return <Fragment key={index}>
              <div className="flex border-black py-2 page-break-inside-avoid">
                <div className="w-1/4 pl-2">{ t(feature[2]??feature[1]) }</div>
                <div className="w-3/4 pr-2"  dangerouslySetInnerHTML={{__html: html }}></div>
              </div>
            </Fragment>
          })
        }

        <div className="flex border-black py-2 font-bold">
          <div className="w-1/4 pl-2">{ listing.price[t("key_wp_pricetypeinternetgerman__c")] ?? t("price") }</div>
          <div className="w-3/4 pr-2">{ priceFormat() }</div>
        </div>

      </div>
  );
}
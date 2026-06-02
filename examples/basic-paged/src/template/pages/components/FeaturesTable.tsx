import currency from 'currency.js';
import { useTranslation } from 'react-i18next';
import { Static } from 'uhuu-components';
import AgentInfo from './AgentInfo';

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

  const rows = features
    .map((feature) => {
      if(!listing[feature[0]][feature[1]]) return null;

      const name = listing[feature[0]][feature[1]];
      const html = typeof(name) === 'string' ?  name.replace(/\n/g, "<br />") : name;

      return {
        id: `feature-${feature[0]}-${feature[1]}`,
        type: 'feature',
        label: t(feature[2]??feature[1]),
        html,
      };
    })
    .filter(Boolean);

  const items = [
    ...rows,
    {
      id: 'price',
      type: 'price',
      label: listing.price[t("key_wp_pricetypeinternetgerman__c")] ?? t("price"),
      value: priceFormat(),
    },
    {
      id: 'agent',
      type: 'agent',
    },
  ];

  return (

      <Static.Flow
        id="property-features"
        items={items}
        getKey={(item) => item.id}
        metaDefaults={{
          feature: { avoidBreakInside: true },
          price: { avoidBreakInside: true },
          agent: { avoidBreakInside: true },
        }}
        className="divide-y text-sm"
        renderItem={(item) => {
          if (item.type === 'agent') {
            return <AgentInfo payload={payload} />;
          }

          if (item.type === 'price') {
            return (
              <div className="flex border-black py-2 font-bold">
                <div className="w-1/4 pl-2">{item.label}</div>
                <div className="w-3/4 pr-2">{item.value}</div>
              </div>
            );
          }

          return (
            <div className="flex border-black py-2">
              <div className="w-1/4 pl-2">{item.label}</div>
              <div className="w-3/4 pr-2" dangerouslySetInnerHTML={{__html: item.html }} />
            </div>
          );
        }}
      />
  );
}

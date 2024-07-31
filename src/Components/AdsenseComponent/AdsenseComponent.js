import React, { useEffect } from "react";

const AdsComponent = (props) => {
  const { dataAdSlot, dataAdLayoutKey } = props;

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-9824707177635245"
      data-ad-slot={dataAdSlot}
      data-ad-layout-key={dataAdLayoutKey}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdsComponent;

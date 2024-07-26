import React, { useEffect } from "react";

const AdSense = ({ client, slot, style, format, responsive }) => {
  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    ></ins>
  );
};

export default AdSense;

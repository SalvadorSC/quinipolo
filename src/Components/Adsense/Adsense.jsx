import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

const AdSense = ({ client, slot, style, format, responsive }) => {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <>
      <Helmet>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-12344"
          crossorigin="anonymous"
        ></script>
      </Helmet>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      ></ins>
    </>
  );
};

export default AdSense;

const AnalyticsIframe = () => {
  return (
    <div className="container-fluid">
      <div className="row" style={{ height: "50vh" }}>
        {/* Col 1 : Vue d'ensemble temps réel */}
        <div
          className="col-md-6 col-12 mb-3 mb-md-0"
          style={{ height: "100%" }}
        >
          <div style={{ border: "1px solid #ccc", height: "100%" }}>
            <iframe
              src="https://analytics.google.com/analytics/web/#/a369094165p505913312/realtime/overview?params=_u..nav%3Dmaui"
              width="100%"
              height="100%"
              frameBorder="0"
              title="GA Realtime Overview"
            ></iframe>
          </div>
        </div>

        {/* Col 2 : Pages temps réel */}
        <div className="col-md-6 col-12" style={{ height: "100%" }}>
          <div style={{ border: "1px solid #ccc", height: "100%" }}>
            <iframe
              src="https://analytics.google.com/analytics/web/#/a369094165p505913312/realtime/pages?params=_u..nav%3Dmaui"
              width="100%"
              height="100%"
              frameBorder="0"
              title="GA Realtime Pages"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsIframe;

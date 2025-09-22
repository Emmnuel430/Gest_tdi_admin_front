const AnalyticsIframe = () => {
  return (
    <div className="container my-4">
      <div className="row g-3">
        <div className="col-md-6 col-12">
          <a
            href="https://analytics.google.com/analytics/web/#/a369094165p505913312/realtime/overview?params=_u..nav%3Dmaui"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-100 py-5 fs-5"
          >
            Voir un aperçu des visiteurs en temps réel
          </a>
        </div>
        <div className="col-md-6 col-12">
          <a
            href="https://analytics.google.com/analytics/web/#/a369094165p505913312/realtime/pages?params=_u..nav%3Dmaui"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success w-100 py-5 fs-5"
          >
            Voir les pages visitées en temps réel
          </a>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsIframe;

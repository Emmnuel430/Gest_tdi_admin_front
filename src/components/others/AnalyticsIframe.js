const AnalyticsIframe = () => {
  const analyticsLinks = [
    {
      title: "Visiteurs en temps réel",
      description: "Voir un aperçu des visiteurs connectés actuellement.",
      url: "https://analytics.google.com/analytics/web/#/a369094165p505913312/realtime/overview?params=_u..nav%3Dmaui",
      color: "primary",
      icon: "fa-users",
    },
    {
      title: "Pages en temps réel",
      description: "Découvrir quelles pages sont visitées en ce moment.",
      url: "https://analytics.google.com/analytics/web/#/a369094165p505913312/realtime/pages?params=_u..nav%3Dmaui",
      color: "success",
      icon: "fa-file-alt",
    },
    {
      title: "Vue d’ensemble",
      description:
        "Obtenir une vue d’ensemble sur le comportement des utilisateurs.",
      url: "https://analytics.google.com/analytics/web/#/a369094165p505913312/reports/explorer?params=_u..nav%3Dmaui&collectionId=business-objectives&ruid=all-pages-and-screens,business-objectives,examine-user-behavior&r=all-pages-and-screens(vue d'ensemble)",
      color: "info",
      icon: "fa-eye",
    },
    {
      title: "Trafic (Vue d’ensemble)",
      description: "Visualiser l’évolution du trafic global.",
      url: "https://analytics.google.com/analytics/web/#/a369094165p505913312/reports/dashboard?params=_u..nav%3Dmaui&collectionId=business-objectives&ruid=business-objectives-raise-brand-awareness-overview,business-objectives,raise-brand-awareness&r=business-objectives-raise-brand-awareness-overview",
      color: "body",
      icon: "fa-square-poll-vertical", //fa-road,
    },
    {
      title: "Engagements & Rétention",
      description:
        "Analyser comment les utilisateurs interagissent entre les pages.",
      url: "https://analytics.google.com/analytics/web/#/a369094165p505913312/reports/explorer?params=_u..nav%3Dmaui&collectionId=business-objectives&ruid=all-pages-and-screens,business-objectives,examine-user-behavior&r=all-pages-and-screens",
      color: "secondary",
      icon: "fa-chart-line",
    },
    {
      title: "Prospects",
      description: "Suivre la génération de leads et conversions.",
      url: "https://analytics.google.com/analytics/web/#/a369094165p505913312/reports/dashboard?params=_u..nav%3Dmaui%26_r.2..selmet%3D%5B%22conversions%22%5D&collectionId=business-objectives&ruid=business-objectives-generate-leads-overview,business-objectives,generate-leads&r=business-objectives-generate-leads-overview",
      color: "danger",
      icon: "fa-crosshairs",
    },
  ];
  return (
    <div className="container my-4">
      <div className="row g-3">
        <h3 className="text-center">Analyse des performances</h3>
        <p className="text-center text-muted">
          Découvrez les principales métriques et insights de votre site. <br />{" "}
          Analytics by Google®.
        </p>
        {analyticsLinks.map((link, idx) => (
          <div className="col-md-6 col-12" key={idx}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover-effect card border shadow-sm rounded-3 text-decoration-none text-dark h-100`}
            >
              <div className={`card-body py-4 text-${link.color}`}>
                <div className="d-flex align-items-center h-100">
                  {/* Partie gauche : icône en grand */}
                  <div className="w-25 text-center">
                    <i className={`fa ${link.icon} fa-3x`}></i>
                  </div>

                  {/* Partie droite : titre + description */}
                  <div className="w-75 ps-3">
                    <h5 className="card-title mb-2 fw-bold">{link.title}</h5>
                    <p className="card-text mb-0">{link.description}</p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsIframe;

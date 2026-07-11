import React from "react";
import { Link } from "react-router-dom";

const HeaderWithFilter = ({
  title,
  title2,
  link,
  linkText,
  linkText2,
  filter,
  setFilter,
  filterOptions = [],
  main,
  onLinkClick,
  sortOption,
  setSortOption,
  dataList,
  setSortedList,
  alphaField,
  dateField,
}) => {
  React.useEffect(() => {
    if (!Array.isArray(dataList)) return;

    let sorted = [...dataList];

    if (!sortOption) {
      setSortedList(dataList);
      return;
    }

    if (sortOption === "updated_desc" && dateField) {
      sorted.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    } else if (sortOption === "alpha" && alphaField) {
      sorted.sort((a, b) =>
        (a[alphaField] || "").localeCompare(b[alphaField] || ""),
      );
    } else if (
      ["date_auj", "date_semaine", "date_mois", "date_annee"].includes(
        sortOption,
      )
    ) {
      const today = new Date();
      sorted = sorted.filter((item) => {
        const itemDate = new Date(item[dateField]);
        if (isNaN(itemDate)) return false;

        switch (sortOption) {
          case "date_auj":
            return itemDate.toDateString() === today.toDateString();
          case "date_semaine":
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(today.getDate() - 7);
            return itemDate >= oneWeekAgo && itemDate <= today;
          case "date_mois":
            return (
              itemDate.getMonth() === today.getMonth() &&
              itemDate.getFullYear() === today.getFullYear()
            );
          case "date_annee":
            return itemDate.getFullYear() === today.getFullYear();
          default:
            return true;
        }
      });
    }

    setSortedList(sorted);
  }, [sortOption, dataList, alphaField, dateField, setSortedList]);

  const hasFiltersOrSort =
    filterOptions.length > 0 ||
    (setSortOption && Array.isArray(dataList) && dataList.length > 0);

  return (
    <div className="mb-4">
      {/* Section Supérieure : Titre & Actions */}
      <div className="row align-items-center g-3 mb-3">
        <div className="col-12 col-sm-auto me-sm-auto">
          {(title || title2) && (
            <h1>{title ? `Liste des ${title}` : title2}</h1>
          )}
        </div>
        <div className="col-12 col-sm-auto text-sm-end">
          {onLinkClick ? (
            <button
              className="btn btn-primary w-100 w-sm-auto d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
              onClick={(e) => {
                e.preventDefault();
                onLinkClick();
              }}
            >
              <span>{linkText2 || linkText}</span>
            </button>
          ) : (
            linkText && (
              <Link
                to={link}
                className="btn btn-primary w-100 w-sm-auto d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
              >
                <span>{linkText}</span>
              </Link>
            )
          )}
        </div>
      </div>

      {/* Section Inférieure : Compteur, Filtres & Tris regroupés */}
      {main > 0 && (
        <div className="card border bg-body p-3 shadow-sm rounded-3">
          <div className="row g-3 align-items-center">
            {/* Compteur Total */}
            <div className="col-12 col-md-auto me-md-auto text-center text-md-start">
              {main !== 0 && (
                <div className="d-inline-flex align-items-center gap-2 bg-body px-3 py-2 rounded-2 border shadow-xs">
                  <span className="text-muted small fw-medium">
                    Total {title || ""}
                  </span>
                  <span className="badge bg-primary rounded-pill px-2.5 py-1.5 fs-6 fw-bold">
                    {main}
                  </span>
                </div>
              )}
            </div>

            {/* Filtres et Tris combinés sur la droite */}
            {hasFiltersOrSort && (
              <div className="col-12 col-md-auto">
                <div className="row g-2 justify-content-center justify-content-md-end">
                  {/* Sélecteur de Filtre */}
                  {filterOptions.length > 0 && (
                    <div className="col-6 col-sm-auto">
                      <select
                        className="form-select bg-body border"
                        onChange={(e) => setFilter(e.target.value)}
                        value={filter}
                        aria-label="Filtrer les résultats"
                      >
                        {filterOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Sélecteur de Tri */}
                  {setSortOption &&
                    Array.isArray(dataList) &&
                    dataList.length > 0 && (
                      <div className="col-6 col-sm-auto">
                        <select
                          id="sort"
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                          className="form-select bg-body border"
                          aria-label="Trier les résultats"
                        >
                          <option value="">Aucun tri</option>
                          {alphaField && (
                            <option value="alpha">Ordre alphabétique</option>
                          )}
                          <option value="date_auj">Créé aujourd'hui</option>
                          <option value="date_semaine">
                            Créé cette semaine
                          </option>
                          <option value="date_mois">Créé ce mois-ci</option>
                          <option value="date_annee">Créé cette année</option>
                          {dateField && (
                            <option value="updated_desc">
                              Dernière mise à jour
                            </option>
                          )}
                        </select>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderWithFilter;

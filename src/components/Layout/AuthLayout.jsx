import Spinner from "react-bootstrap/Spinner";
import loginImage from "../../assets/img/login.png";
import logo from "../../assets/img/logo.png";

const AuthLayout = ({ title, onSubmit, loading, submitDisabled, children }) => {
  return (
    <div>
      <section>
        <div className="container">
          <div className="user signinBx">
            <div className="imgBx bg-body">
              <img src={loginImage} alt="Login Illustration" />
            </div>

            <div className="formBx bg-body">
              <img src={logo} alt="Logo" />

              <form onSubmit={onSubmit}>
                <h2 className="h2 text-primary">{title}</h2>

                {children}

                <div className="d-flex align-items-center mt-3">
                  <input
                    type="submit"
                    className="btn btn-primary m-0"
                    value={loading ? "Connexion ..." : "Connexion"}
                    aria-disabled={submitDisabled}
                    onClick={(e) => {
                      if (submitDisabled) {
                        e.preventDefault();
                        return;
                      }
                    }}
                    style={{
                      cursor: submitDisabled ? "not-allowed" : "pointer",
                      opacity: submitDisabled ? 0.6 : 1,
                    }}
                  />

                  {loading && (
                    <Spinner
                      animation="border"
                      size="sm"
                      className="my-auto ms-2"
                    />
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuthLayout;

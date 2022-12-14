import { RecoilRoot } from "recoil";
import { Switch, Route, HashRouter } from "react-router-dom";
import PrivateRoute from "utils/components/route/PrivateRoute";
import NotMatch from "utils/components/route/NotMatch";
import Utils from "utils/Utils";
import Spinner from "utils/components/spinner";
import Login from "components/account/auth/login";
import Member from "components/account/member";
import Profile from "components/account/auth/profile";

Utils.responseIntercept();

function App() {
  const authData = Utils.getStorageObj("auth");

  return (
    <div>
      <RecoilRoot>
        <Spinner />
        <HashRouter>
          <Switch>
            <PrivateRoute path="/" component={Profile} exact />
            <Route path="/login" component={Login} exact />

            {authData.is_admin && (
              <PrivateRoute path="/user" component={Member} exact />
            )}

            <Route component={NotMatch} />
          </Switch>
        </HashRouter>
      </RecoilRoot>
    </div>
  );
}

export default App;

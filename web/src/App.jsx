import { RecoilRoot } from "recoil";
import { Switch, Route, HashRouter } from "react-router-dom";
// import PrivateRoute from "utils/components/route/PrivateRoute";
import NotMatch from "utils/components/route/NotMatch";
import Utils from "utils/Utils";
import Spinner from "utils/components/spinner";
import Login from "components/account/auth/login";
import Member from "components/account/member";
import Profile from "components/account/auth/profile";

Utils.responseIntercept();

function App() {
  return (
    <div>
      <RecoilRoot>
        <Spinner />
        <HashRouter>
          <Switch>
            <Route path="/" component={Profile} exact />
            <Route path="/login" component={Login} exact />

            <Route path="/member" component={Member} exact />

            <Route component={NotMatch} />
          </Switch>
        </HashRouter>
      </RecoilRoot>
    </div>
  );
}

export default App;

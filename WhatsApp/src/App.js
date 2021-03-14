import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from './Login';
import { useStateValue } from './StateProvider';

import { connect } from "react-redux";

function App({ user }) {


  // const [{ user }, dispatch] = useStateValue();

  return (
    // BEM naming convention
    <div className="app">

      {!user ? (
        <Login/>
      ) : (
          <div className="app_body">
            <Router>
              <Sidebar />
              <Switch>
                <Route path="/rooms/:roomId">
                  <Chat />
                </Route>
                <Route path="/">
                  <Chat />
                </Route>
              </Switch>
            </Router>
          </div>
        )}
    </div>
  );
}

const mapStateToProps = ({ userReducer }) => {
  return {
    user: userReducer.user
  }
}

export default connect(mapStateToProps)(App);

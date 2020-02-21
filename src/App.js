import React, { Component } from 'react';
import { withRouter, Route, Switch, BrowserRouter as Router } from 'react-router-dom';

// import routes from './routes';
import './custom.css';
import './App.scss';

//Fake backend
import fakeBackend from './helpers/fakeBackend';
/* Import Main Auth Route In Application */
import Routes from './routing';
/*Import UnAuthorized Pages in Main Route */
import Pageslogin from './views/Auth/Login';
import ForgetPassword from './views/Auth/ForgetPassword';
import Page404 from './views/Auth/pages-404';
import { NotificationContainer } from './components/ReactNotifications'
import request from './helpers/api';
import { SetSiteInfo } from './redux/actions';
import { connect } from 'react-redux'
// Activating fake backend
fakeBackend();
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {
    let checkinfo = localStorage.getItem('siteinfo')
    if (!checkinfo) {
      request({
        url: 'api/admin/siteinfo',
        method: 'GET'
      }).then(res => {
        if (res && res.status === 200) {
          localStorage.setItem('siteinfo', true)
          this.props.SetSiteInfo(res.data)
          this.ChangeFavicon(res.data.favicon)
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      this.ChangeFavicon(this.props.siteInfo.favicon)
    }
  }
  ChangeFavicon = (url) => {
    (function () {
      var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = url;
      document.getElementsByTagName('head')[0].appendChild(link);
    })();
  }
  render() {
    return (
      <React.Fragment>
        <Router basename={'/'}>
          <NotificationContainer />
          <Switch>
            <Route exact path={'/'} component={Pageslogin} />
            <Route exact path={'/forget-password'} component={ForgetPassword} />
            <Route exact path={'/page-404'} component={Page404} />
            <Routes {...this.props} />
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}
const mapToStateProps = (state) => {
  return state.Layout
}

export default withRouter(connect(mapToStateProps, { SetSiteInfo })(App));



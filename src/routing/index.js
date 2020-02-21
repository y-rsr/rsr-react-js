import React, { Component } from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash'
// import Layout from '../components/Layout';
import Topbar from '../components/Layout/Topbar';
import Sidebar from '../components/Layout/Sidebar';
import Footer from '../components/Layout/Footer';
// Get all Auth methods
import { isUserAuthenticated } from '../helpers/authUtils';
/* Import All Pages */
/* Admin pages */
import Dashboard from '../views/Dashboard/dashboard';
import AdminList from '../views/Auth/list'
import AddNewadmin from '../views/Auth/add'
import ChangePassword from '../views/Auth/change_password';
import View from '../views/Auth/view';
import SMTP from '../views/Auth/smtp'
import MainSetting from '../views/Auth/setting';
//Owner Mangement
import AddOwner from '../views/owners/add';
import ViewOwner from '../views/owners/view';
import OwnerList from '../views/owners/list';
import OwnerOpenHour from '../views/owners/ownerOpenHour';
import AddEdid from '../views/driver/add';
import DriverViews from '../views/driver/views';
import LienAddEdit from '../views/lienHolder/add';
import LienView from '../views/lienHolder/views';
class Routes extends Component {
    render() {
        let { adminAccess, user } = this.props, Admintype = _.get(user, 'admintype', false)
        return (
            <React.Fragment>
                <div id="wrapper">
                    <Topbar {...this.props} Admintype={Admintype} />
                    <Sidebar {...this.props} />
                    {/* <Layout> */}
                    <div className="content-page">
                        <div className="content">
                            <Switch>
                                <PrivateRoute path='/admin/dashboard' component={Dashboard} />
                                <PrivateRoute path='/admin/change/password' component={ChangePassword} />
                                <PrivateRoute path='/admin/list' component={AdminList} />
                                <PrivateRoute path='/admin/add' component={AddNewadmin} />
                                <PrivateRoute path='/admin/smtp' component={SMTP} />
                                <PrivateRoute path='/admin/view' component={View} />
                                <PrivateRoute path='/admin/setting' component={MainSetting} />
                                {/* ---------------Owners Management---------------------*/}
                                <PrivateRoute path='/admin/owner/list' component={OwnerList} Access={_.get(adminAccess, '0', {})} Admintype={Admintype} />
                                <PrivateRoute path='/admin/owner/add' component={AddOwner} />
                                <PrivateRoute path='/admin/owner/view' component={ViewOwner} />
                                <PrivateRoute path='/admin/owner/open_hours/:id' component={OwnerOpenHour} />
                                {/*-------------- Owners Management End-----------------*/}
                                {/* ---------------Driver Management---------------------*/}
                                <PrivateRoute path='/admin/driver/add' component={AddEdid} />
                                <PrivateRoute path='/admin/driver/view' component={DriverViews} />
                                <PrivateRoute path='/admin/lien/add' component={LienAddEdit} />
                                <PrivateRoute path='/admin/lien/view' component={LienView} />
                                <Redirect to='/page-404' />
                            </Switch>
                        </div>
                    </div>
                    <Footer />
                    {/* </Layout> */}
                </div>
            </React.Fragment >
        );
    }
}
const mapStateToProps = (state) => {
    const { adminAccess } = state.Layout, { user } = state.Login
    return { adminAccess, user }
}

export default withRouter(connect(mapStateToProps, null)(Routes));


const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        isUserAuthenticated() === true
            ? <Component {...props} {...rest} />
            : <Redirect to='/' />
    )} />
)
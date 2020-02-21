import React, { Component, } from 'react';
import { Button, Col, Row, Card } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { checkLogin, loginUserSuccessful, SetSiteInfo } from '../../redux/actions';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import logosm from '../../assets/images/logo-sm.png';
import request from '../../helpers/api'
import { NotificationManager } from '../../components/ReactNotifications'
import {isEmpty} from 'lodash'
class Pageslogin extends Component {

    constructor(props) {
        super(props);
        this.state = { username: '', password: '' }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    onChange = (e) => {
        let { name, value } = e.target
        this.setState({ [name]: value })
    }
    componentDidMount() {
        let { user } = this.props
        if (user) {
            this.props.history.push('/admin/dashboard')
        }

    }
    handleSubmit() {
        request({
            url: '/api/admin/login',
            method: 'POST',
            data: this.state
        }).then(res => {
            if (res && res.status === 200) {
                this.props.checkLogin(res.data[0], this.props.history);
            }
        }).catch(err => {
            if (err && err.status === 401) {
                NotificationManager.error(err.data[0].msg || 'Invalid Credentials', 'ERROR', 3000, null, null, 'filled', 'times-circle')
            }
        })
    }

    render() {
        let { username, password } = this.state, { siteInfo } = this.props
        console.log()
        return (
            <React.Fragment>
                <div className="wrapper-page">
                    <Card className="overflow-hidden account-card mx-3">
                        <div className="bg-primary p-4 text-white text-center position-relative">
                            <h4 className="font-20 m-b-5">Welcome Back !</h4>
                            <p className="text-white-50 mb-4">Sign in to continue to {!isEmpty(siteInfo) ?siteInfo.sitename:'RideshareRental'}.</p>
                            <Link to="/" className="logo logo-admin"><img src={!isEmpty(siteInfo) ? siteInfo.favicon : logosm} height="24" alt="logo" /></Link>
                        </div> 
                        <div className="account-card-content">
                            <AvForm className="form-horizontal m-t-30" onValidSubmit={this.handleSubmit} >
                                <AvField name="username" label="Username/Email" value={username} placeholder="Enter Valid Username/Email" type="text" required errorMessage='Enter Valid Username/Email' onChange={e => this.onChange(e)} />
                                <AvField name="password" label="Password" value={password} placeholder="Enter Valid Password" type="password" required errorMessage=' Enter Valid Password' onChange={e => this.onChange(e)} />
                                <Row className="form-group m-t-20">
                                    <Col sm="6">
                                    </Col>
                                    <Col sm="6" className="text-right">
                                        <Button color="primary" className="w-md waves-effect waves-light" type="submit">Log In</Button>
                                    </Col>
                                </Row>
                                <Row className="form-group m-t-10 mb-0">
                                    <Col md="12" className="m-t-20">
                                        <Link to="/forget-password"><i className="mdi mdi-lock"></i> Forgot your password?</Link>
                                    </Col>
                                </Row>
                            </AvForm>
                        </div>
                    </Card>
                </div>
            </React.Fragment>
        );
    }
}

const mapStatetoProps = state => {
    const { user, loginError, loading } = state.Login;
    const { siteInfo } = state.Layout;
    return { user, loginError, loading, siteInfo };
}

export default withRouter(connect(mapStatetoProps, { checkLogin, loginUserSuccessful, SetSiteInfo })(Pageslogin));





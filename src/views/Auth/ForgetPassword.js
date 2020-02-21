import React, { Component } from 'react';
import { Button, Card, Col, Row } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import logosm from '../../assets/images/logo-sm.png'
import { forgetUser } from '../../redux/actions';
import { AvForm, AvField } from 'availity-reactstrap-validation';

class ForgetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = { username: "" }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event, values) {
        this.props.forgetUser(values.username, this.props.history);
    }

    render() {
        let { siteInfo } = this.props
        return (
            <React.Fragment>
                <div className="home-btn d-none d-sm-block">
                    <Link to="/" className="text-dark"><i className="fas fa-home h2"></i></Link>
                </div>

                <div className="wrapper-page">
                    <Card className="overflow-hidden account-card mx-3">
                        <div className="bg-primary p-4 text-white text-center position-relative">
                            <h4 className="font-20 mb-4">Forgot password ?</h4>
                            <Link to="/" className="logo logo-admin"><img src={siteInfo ? siteInfo.favicon : logosm} height="24" alt="logo" /></Link>
                        </div>
                        <div className="account-card-content">
                            <AvForm className="form-horizontal m-t-30" onValidSubmit={this.handleSubmit} >
                                <AvField name="username" label="Email" value={this.state.username} placeholder="Enter Email" errorMessage='Enter Valid Email' type="text" required />

                                <Row className="form-group m-t-20 mb-0">
                                    <Col md="12" className="text-right">
                                        <Button color="primary" className="w-md waves-effect waves-light" type="submit">Reset</Button>
                                    </Col>
                                </Row>

                            </AvForm>
                        </div>
                    </Card>

                    <div className="m-t-40 text-center">
                        <p>Remember It ? <Link to="/" className="font-500 text-primary"> Sign In here </Link> </p>
                        {/* <p>© {new Date().getFullYear()} Veltrix. Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand</p> */}
                    </div>

                </div>
            </React.Fragment>
        );
    }
}



const mapStatetoProps = state => {
    const { user, loginError, loading } = state.Forget;
    const { siteInfo } = state.Layout;
    return { user, loginError, loading, siteInfo };
}

export default withRouter(connect(mapStatetoProps, { forgetUser })(ForgetPassword));





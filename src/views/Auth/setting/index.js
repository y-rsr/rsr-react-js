import React, { Component, Fragment } from 'react';
import { TabPane, TabContent, Col, Container, Row, CardBody, Card, Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames';
import Setting from './settings';
import SocialSetting from './social_setting';
import Webmaster from './webmaster';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import request from '../../../helpers/api';
import _ from 'lodash'
class MainSetting extends Component {
    state = {
        activeTab: '1',
        pageone: {},
        pagetwo: {},
        pagethree: {}
    }
    componentDidMount() {
        request({
            url: 'api/admin/settings',
            method: 'GET'
        }).then(res => {
            if (res && res.status === 200) {
                this.setState({
                    pageone: _.get(res, 'data.2', {}),
                    pagetwo: _.get(res, 'data.3', {}),
                    pagethree: _.get(res, 'data.1', {})
                })
            }
        }).catch(err => {
            console.log('globle error', err)
        })
    }
    toggle = (tab) => {
        this.setState({ activeTab: tab })
    }
    render() {
        let { pageone, pagethree, pagetwo } = this.state
        return (
            <Fragment>
                <Container fluid>
                    <div className="page-title-box">
                        <Row className="align-items-center">
                            <Col sm="6">
                                <h4 className="page-title">ADMIN SETTINGS</h4>
                            </Col>
                            {/* {className="nav-justified"} */}
                            <Col sm="6">
                                <Nav pills>
                                    <NavItem>
                                        <NavLink className={classnames({ active: this.state.activeTab === '1' })}
                                            onClick={() => { this.toggle('1'); }}>
                                            <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                            <span className="d-none d-sm-block">Site Info</span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className={classnames({ active: this.state.activeTab === '2' })}
                                            onClick={() => { this.toggle('2'); }}>
                                            <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                            <span className="d-none d-sm-block">API Keys</span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className={classnames({ active: this.state.activeTab === '3' })}
                                            onClick={() => { this.toggle('3'); }}>
                                            <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                            <span className="d-none d-sm-block"> SEO Details</span>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <ReactCSSTransitionGroup
                                        // component="div"
                                        // transitionName="TabsAnimation"
                                        transitionName="TabsAnimation"
                                        transitionEnterTimeout={400}
                                        transitionLeaveTimeout={400}
                                    >
                                        <TabContent activeTab={this.state.activeTab} >
                                            <TabPane tabId="1" className="p-3">
                                                <Setting data={pageone} />
                                            </TabPane>
                                            <TabPane tabId="2" className="p-3">
                                                <SocialSetting data={pagetwo} />
                                            </TabPane>
                                            <TabPane tabId="3" className="p-3">
                                                <Webmaster data={pagethree} />
                                            </TabPane>
                                        </TabContent>
                                    </ReactCSSTransitionGroup>

                                </CardBody>

                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        );
    }
}

export default MainSetting;
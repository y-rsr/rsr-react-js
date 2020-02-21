import React, { Component, Fragment } from 'react';
import { Container, Row, Col, Card, CardBody, FormGroup, TabContent, TabPane, Label, Nav, NavItem, NavLink } from 'reactstrap';
import _ from 'lodash'
import request from '../../helpers/api';
class ViewOwner extends Component {
    state = {
        rowid: _.get(this.props, 'location.state.rowid', false),
        activeTab: '1',
    }
    componentDidMount() {
        let { rowid } = this.state
        if (rowid) {
            request({
                url: `api/owner/view/${rowid}`,
                method: 'GET'
            }).then(res => {
                if (res && res.status === 200) {
                    let result = _.get(res, 'data', false)
                    this.setState({ result })
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }
    toggle = (tab) => {
        this.setState({ activeTab: tab })
    }


    render() {
        let { result } = this.state
        return (
            <Fragment>
                <Container>
                    <div className="page-title-box">
                        <Row className="align-items-center">
                            <Col sm="8">
                                <h4 className="page-title">VIEW OWNER</h4>
                            </Col>
                            <Col sm="4">
                                <Nav pills>
                                    <NavItem>
                                        <NavLink className={this.state.activeTab === '1' ? 'active' : ''}
                                            onClick={() => { this.toggle('1'); }}>
                                            <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                            <span className="d-none d-sm-block">Member Details</span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className={this.state.activeTab === '2' ? 'active' : ''}
                                            onClick={() => { this.toggle('2'); }}>
                                            <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                            <span className="d-none d-sm-block">ACH Details</span>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </Col>
                        </Row>
                    </div>
                    <Card>
                        <CardBody>
                            <TabContent activeTab={this.state.activeTab} >
                                <TabPane tabId="1" className="p-3">
                                    <FormGroup row>
                                        <Label sm={3} >Name </Label>
                                        <Col sm={6}>
                                            {_.get(result, 'name', 'Not Available')}
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={3} >Email </Label>
                                        <Col sm={6}>
                                            {_.get(result, 'email', 'Not Available')}
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={3} >Mobile</Label>
                                        <Col sm={6}>
                                            {_.get(result, 'mobile', 'Not Available')}
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={3}>User Image</Label>
                                        <Col sm={6}>
                                            {_.get(result, 'userImage', false) ? <img width='50px' src={_.get(result, 'userImage', false)} alt='UserImage' /> : ''}
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={3}>Street</Label>
                                        <Col sm={6}>
                                            {_.get(result, 'street', 'Not Available')}
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={3}>H/Apt No</Label>
                                        <Col sm={6}>
                                            {_.get(result, 'house', 'Not Available')}
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={3}>Zip</Label>
                                        <Col sm={6}>
                                            {_.get(result, 'zip', 'Not Available')}
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={3}></Label>
                                        <Col sm={6}>
                                            <p className='btn btn-success' onClick={() => this.props.history.goBack()}>Back</p>
                                        </Col>
                                    </FormGroup>
                                </TabPane>
                                <TabPane tabId="2" className="p-3">
                                    <FormGroup row>
                                        <Label sm={3}>Bank Name</Label>
                                        <Col sm={6}>
                                            {_.get(result, 'achbank', 'Not Available')}
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={3}>Account Name</Label>
                                        <Col sm={6}>
                                            {_.get(result, 'achacntname', 'Not Available')}
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={3}>Account Number</Label>
                                        <Col sm={6}>
                                            {_.get(result, 'achaccount', 'Not Available')}
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={3}>ABA Number</Label>
                                        <Col sm={6}>
                                            {_.get(result, 'abanumber', 'Not Available')}
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={3}>Account Type</Label>
                                        <Col sm={6}>
                                            {_.get(result, 'achacnttype', 'Not Available')}
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={3}>Paypal Email ID</Label>
                                        <Col sm={6}>
                                            {_.get(result, 'achemail', 'Not Available')}
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={3}>Account Usage</Label>
                                        <Col sm={6}>
                                            {_.get(result, 'achacntusage', 'Not Available')}
                                        </Col>
                                    </FormGroup>

                                </TabPane>

                            </TabContent>
                        </CardBody>
                    </Card>
                </Container>
            </Fragment >
        );
    }
}

export default ViewOwner;
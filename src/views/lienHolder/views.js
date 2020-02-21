import React, { Component, Fragment } from 'react';
import { FormGroup, Col, Label, Form, Container, Row, Card, CardBody, Input, Button, NavItem, NavLink, Nav, TabPane, TabContent } from 'reactstrap'
import { NotificationManager } from '../../components/ReactNotifications';
import { get } from 'lodash'
import request from '../../helpers/api';
let temparray = ["Vehicles", "Deleted Cars", "Driver History", "Booking Documents", "Contract History", "Driver Dues", "Claims", "Gps"]
class LienView extends Component {
    state = {
        // rowids: '5e350cd757831b0640eb9d35',
        rowid: '5e350cd757831b0640eb9d35',
        activeTab: '1',
        checkall: false
    };
    componentDidMount() {
        let { rowid } = this.state
        if (rowid)
            request({
                url: `api/lien/${rowid}`,
                method: 'GET'
            }).then(res => {
                if (res && res.status === 200) {
                    let result = res.data
                    this.setState({ result })
                    result.privileges && result.privileges.map((value) => {
                        if (document.getElementById(value)) {
                            document.getElementById(value).checked = true
                        }
                        return true
                    })
                    if (result.privileges.length === temparray.length) {
                        this.setState({ checkall: true })
                    }
                }
            }).catch(err => {
                console.log(err)
            })
    }
    toggle = (tab) => {
        this.setState({ activeTab: tab })
    }
    render() {
        let { firstname, lastname, zip, city, password, c_password, mobile, email, state, loading, firsnameError, lastnamneError, emailError, streetError, cityError, stateError, countryError, country, c_passwordError, passwordError, rowid, checkall, result } = this.state
        console.log(result)
        return (
            <Fragment>
                <Container fluid>
                    <div className='page-title-box'>
                        <Row className='align-items-center'>
                            <Col sm='8'>
                                <h4 className="page-title">LIEN HOLDERS</h4>
                            </Col>
                            <Col sm='4'>
                                <Nav pills>
                                    <NavItem>
                                        <NavLink className={this.state.activeTab === '1' ? 'active' : ''}
                                            onClick={() => { this.toggle('1'); }}>
                                            <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                            <span className="d-none d-sm-block">Lien Details</span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className={this.state.activeTab === '2' ? 'active' : ''}
                                            onClick={() => { this.toggle('2'); }}>
                                            <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                            <span className="d-none d-sm-block">Privileges</span>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col sm='12'>
                            <Card>
                                <CardBody>
                                    <TabContent activeTab={this.state.activeTab} >
                                        <TabPane tabId="1" className="p-3">
                                            <FormGroup row>
                                                <Label sm={4}>First Name </Label>
                                                <Col sm={8}>
                                                    {get(result, 'firstname', '')}
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={4}>Last Name </Label>
                                                <Col sm={8}>
                                                    {get(result, 'lastname', '')}
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={4}>Email Address </Label>
                                                <Col sm={8}>
                                                    {get(result, 'email', '')}
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={4} >Mobile </Label>
                                                <Col sm={8}>
                                                    {get(result, 'mobile', '')}
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={4}>Street</Label>
                                                <Col sm={8}>
                                                    {get(result, 'street', '')}
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={4}>City </Label>
                                                <Col sm={8}>
                                                    {get(result, 'city', '')}
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={4}>State </Label>
                                                <Col sm={8}>
                                                    {get(result, 'state', '')}
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={4}>Zip </Label>
                                                <Col sm={8}>
                                                    {get(result, 'zip', '')}
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={4}>Country </Label>
                                                <Col sm={8}>
                                                    {get(result, 'country', '')}
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={4}>Status</Label>
                                                <Col sm={8}>
                                                    {get(result, 'status', '')}
                                                </Col>
                                            </FormGroup>
                                        </TabPane>
                                        <TabPane tabId="2" className="p-3">
                                            <FormGroup row>
                                                <Label sm='4'>Privileges</Label>
                                                <Col>
                                                    <label>
                                                        <input type='checkbox' id='checkall' onChange={() => { }} checked={checkall} ></input>
                                                        Select All
                                                    </label>
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm='4'>Mangement Name</Label>
                                                <Col>
                                                    <label>View</label>
                                                </Col>
                                            </FormGroup>
                                            {temparray && temparray.map((value, index) => {
                                                return <FormGroup key={index} row>
                                                    <Label sm='4'>{value}</Label>
                                                    <Col>
                                                        <input type='checkbox' id={value}></input>
                                                    </Col>
                                                </FormGroup>
                                            })}
                                            <Button style={{marginLeft:'313px'}} color='success' onClick={()=>this.toggle('1')}>Back</Button>
                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        );
    }
}

export default LienView;
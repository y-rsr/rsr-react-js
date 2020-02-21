import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, FormGroup, Button, Label } from 'reactstrap';
import request from '../../helpers/api';
import { Link } from 'react-router-dom';
import moment from 'moment';
class View extends Component {
    state = {
        name: '',
        username: '',
        email: '',
        date: new Date(),
        privileges: [],
        rowid: (this.props.location.state && this.props.location.state.rowid) || false
    }
    componentDidMount() {
        let { rowid } = this.state
        if (rowid) {
            request({
                url: `api/subadmin/${rowid}`,
                method: 'GET'
            }).then(res => {
                if (res && res.status === 200) {
                    let result = res.data
                    this.setState({
                        name: result.name,
                        email: result.email,
                        username: result.username,
                        privileges: result.privileges,
                        date: result.created
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }
    render() {
        let { name, email, username, privileges,date } = this.state
        return (
            <React.Fragment>
                <Container fluid>
                    <div className="page-title-box">
                        <Row className="align-items-center">
                            <Col sm="6">
                                <h4 className="page-title">VIEW SUBADMIN</h4>
                            </Col>
                            <Col sm="6">
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                        <FormGroup row>
                                            <Label sm={5}>Name</Label>
                                            <Col sm={5}>
                                                <Label>{name}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={5}>Email</Label>
                                            <Col sm={5}>
                                                <Label>{email}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={5}>Username</Label>
                                            <Col sm={5}>
                                                <Label>{username}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={5}>Registeration Date</Label>
                                            <Col sm={5}>
                                                <Label>{moment(date).format('YYYY-MM-DD')}</Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row >
                                            <Label sm={4}>Management Name</Label>
                                            <Col sm={2}>View</Col>
                                            <Col sm={2}>Add </Col>
                                            <Col sm={2}>Edit </Col>
                                            <Col sm={2}>Delete</Col>
                                        </FormGroup>
                                        {privileges && privileges.map((value, index) => {
                                            return <FormGroup row key={index}><Label key={index} sm={4}>{value.access}</Label>
                                                <Col sm={2}>
                                                    <input type='checkbox' checked={value.view} onChange={() => { }} />
                                                </Col>
                                                <Col sm={2}>
                                                    <input type='checkbox' checked={value.add} onChange={() => { }} />
                                                </Col>
                                                <Col sm={2}>
                                                    <input type='checkbox' checked={value.edit} onChange={() => { }} />
                                                </Col>
                                                <Col sm={2}>
                                                    <input type='checkbox' checked={value.delete} onChange={() => { }} />
                                                </Col>
                                            </FormGroup>
                                        })}
                                        <div className='text-center'>
                                            <Link to='/admin/list'><Button color='success'>Back</Button></Link>
                                        </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>

        );
    }
}
export default View;
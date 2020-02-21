import React, { useEffect, useState, Fragment } from 'react';
import request from '../../helpers/api';
import { FormGroup, Col, Label, Container, Row, Card, CardBody } from 'reactstrap'
import { get } from 'lodash'
import moment from 'moment'
function DriverViews(props) {
    let [result, setResult] = useState({})
    useEffect(() => {
        request({
            url: `api/driver/view/${"5e33cf0f22ce9b15fc933cf3"}`,
            method: 'GET'
        }).then(res => {
            if (res && res.status === 200) {
                setResult(res.data)
            }
        }).catch(err => {
            console.log(err)
        })
    }, [])
    return (
        <Fragment>
            <Container fluid>
                <div className='page-title-box'>
                    <Row className='align-items-center'>
                        <Col sm='6'>
                            <h4 className="page-title">View Driver</h4>
                        </Col>
                        <Col sm='6'></Col>
                    </Row>
                </div>
                <Row>
                    <Col sm='12'>
                        <Card>
                            <CardBody>
                                <FormGroup row>
                                    <Label sm='4'>First Name</Label>
                                    <Col sm={8}>
                                        {get(result, 'firstname', 'Not Avaliable')}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label sm='4'>Last Name</Label>
                                    <Col sm={8}>
                                        {get(result, 'lastname', 'Not Avaliable')}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label sm='4'>Sponsor</Label>
                                    <Col sm={8}>
                                        {get(result, 'sponsor', 'Not Avaliable')}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label sm='4'>Date Of Birth</Label>
                                    <Col sm={8}>
                                    {moment(get(result, 'dob', 'Not Avaliable')).format('DD/MM/YYYY')}
                                        {/* {get(result, 'dob', 'Not Avaliable')} */}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label sm='4'>User Image</Label>
                                    <Col sm={8}>
                                        {get(result, 'userImage', '') !== '' ? <img src={get(result, 'userImage', '')} alt='userImage' width='100px'></img> : ''}
                                    </Col>
                                </FormGroup>
                                <h3>Address</h3>
                                <FormGroup row>
                                    <Label sm={4}>Street</Label>
                                    <Col sm={8}>
                                        {get(result, 'street', 'Not Avaliable')}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label sm={4}>H/Apt No </Label>
                                    <Col sm={8}>
                                        {get(result, 'house', 'Not Avaliable')}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label sm={4}>City </Label>
                                    <Col sm={8}>
                                        {get(result, 'city', 'Not Avaliable')}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label sm={4}>Zip </Label>
                                    <Col sm={8}>
                                        {get(result, 'zip', 'Not Avaliable')}
                                    </Col>
                                </FormGroup>
                                <h3>Contact Information</h3>
                                <FormGroup row>
                                    <Label sm={4} >Email </Label>
                                    <Col sm={8}>
                                        {get(result, 'email', 'Not Avaliable')}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label sm={4} >Mobile </Label>
                                    <Col sm={8}>
                                        {get(result, 'mobile', 'Not Avaliable')}
                                    </Col>
                                </FormGroup>
                                <h3>license Information</h3>
                                <FormGroup row>
                                    <Label sm={4} >License Number</Label>
                                    <Col sm={8}>
                                        {get(result, 'license', 'Not Avaliable')}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label sm={4} >Expiration Date</Label>
                                    <Col sm={8}>
                                        {moment(get(result, 'licexpdate', 'Not Avaliable')).format('DD/MM/YYYY')}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label sm={4} >State</Label>
                                    <Col sm={8}>
                                        {get(result, 'state', 'Not Avaliable')}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label sm={4} >Background Check Status</Label>
                                    <Col sm={8}>
                                        {get(result, 'firstnamea', 'Not Avaliable')}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label sm={4} >Driving Licence</Label>
                                    <Col sm={8}>
                                        {get(result, 'licImage', '') !== '' ? <img src={get(result, 'licImage', '')} alt='licImage' width='100px'></img> : ''}
                                    </Col>
                                </FormGroup>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
}

export default DriverViews;
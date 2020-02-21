import React from 'react'
import { Button, Form, FormGroup, Label, Input, Col, Container, Row, CardBody, Card } from 'reactstrap';
import request from '../../helpers/api';
import _ from 'lodash'
import { NotificationManager } from '../../components/ReactNotifications';
export default class SMTP extends React.Component {
    state = {
        host: '',
        email: '',
        password: '',
        port: '',
        hostError: false
    }
    componentDidMount() {
        request({
            url: 'api/admin/settings',
            method: 'GET'
        }).then(res => {
            if (res && res.status === 200) {
                let result = _.get(res, 'data.0', false)
                if (result)
                    this.setState({
                        host: result.host,
                        email: result.email,
                        password: result.password,
                        port: result.port,
                    })
            }
        }).catch(err => {
            console.log(err)
        })
    }
    onChange = (e, name) => {
        this.setState({ [e.target.name]: e.target.value, [name]: false })
    }
    clear = () => {
        this.setState({ host: '', email: '', password: '', port: '' })
    }
    onSubmit = (e) => {
        e.preventDefault()
        let { host, email, password, port } = this.state, formcheck = true
        if (host === '') {
            this.setState({ hostError: 'Enter Valid SMTP Host' })
            formcheck = false
        }
        if (email === '') {
            this.setState({ EmailError: 'Enter Valid SMTP Email' })
            formcheck = false
        }
        if (password === '') {
            this.setState({ passError: 'Enter Valid SMTP Password' })
            formcheck = false
        }
        if (port === '') {
            this.setState({ portError: 'Enter Valid SMTP Port' })
            formcheck = false
        }
        if (formcheck) {
            request({
                url: 'api/admin/settings/smtp',
                method: 'POST',
                data: {
                    host,
                    port,
                    email,
                    password
                }
            }).then(res => {
                if (res && res.status === 200) {
                    NotificationManager.success(res.data[0].msg, 'SUCCESS', 3000, null, null, 'filled')
                }
            }).catch(err => {
                if (err && err.status === 400) {
                    NotificationManager.error(err.data[0].msg, 'ERROR', 3000, null, null, 'filled')
                }
            })
        }
    }
    render() {
        let { host, email, password, port, hostError, portError, EmailError, passError } = this.state
        return (
            <React.Fragment>
                <Container fluid>
                    <div className="page-title-box">
                        <Row className="align-items-center">
                            <Col sm="6">
                                <h4 className="page-title">SMTP SETTINGS</h4>
                            </Col>
                            <Col sm="6">
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <Form noValidate onSubmit={(e) => {
                                        this.onSubmit(e)
                                    }}>
                                        <FormGroup row>
                                            <Label sm={4}>SMTP Host &nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={6}>
                                                <Input type="text" className={hostError ? 'is-invalid form-control' : ''} name="host" value={host} placeholder="Enter SMTP host" onChange={(e) => this.onChange(e, 'hostError')} />
                                                {hostError && <span className='invalid-feedback'>{hostError}</span>}
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={4}>SMTP Port &nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={6}>
                                                <Input type="number" name="port" value={port} placeholder="Enter SMTP Port" className={portError ? 'is-invalid form-control' : ''} onChange={(e) => this.onChange(e, 'portError')} />
                                                {portError && <span className='invalid-feedback'>{portError}</span>}
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={4}>SMTP Email&nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={6}>
                                                <Input type="email" name="email" value={email} placeholder="Enter SMTP Email" onChange={(e) => this.onChange(e, 'EmailError')} className={EmailError ? 'is-invalid form-control' : ''} />
                                                {EmailError && <span className='invalid-feedback'>{EmailError}</span>}
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={4}>SMTP Password&nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={6}>
                                                <Input type="password" name="password" value={password} placeholder="Enter SMTP Password" onChange={(e) => this.onChange(e, 'passError')} className={passError ? 'is-invalid form-control' : ''} />
                                                {passError && <span className='invalid-feedback'>{passError}</span>}
                                            </Col>
                                        </FormGroup>

                                        <div className='form-submit'><Button color='success'>Submit</Button><Button onClick={() => this.clear()}>Clear</Button></div>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }

}
// onChange={(e) => {
//     this.setState({ [e.target.name]: e.target.value.replace(/[^0-9]+/g, '') })
// }}
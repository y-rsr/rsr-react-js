import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, FormGroup, Button, Label } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { NotificationManager } from '../../components/ReactNotifications'
import request from '../../helpers/api';
import { connect } from 'react-redux';

class ChangePassword extends Component {
    state = {
        oldpassword: '',
        password: '',
        c_password: ''
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    onValidSubmit = () => {
        let { oldpassword, password, c_password } = this.state
        if (password === c_password) {
            request({
                url: `api/admin/change/password/${this.props._id}`,
                method: 'POST',
                data: {
                    currentPwd: oldpassword,
                    newPwd: password
                }
            }).then(res => {
                if (res && res.status === 200) {
                    window.location.reload()
                }
            }).catch(err => {
                if(err&&err.status===401){
                    NotificationManager.error(err.data[0].msg, 'ERROR', 3000, null, null, 'filled')
                }
            })
        } else {
            NotificationManager.error('Confirm password must be same as required password', 'ERROR', 3000, null, null, 'filled')
            return
        }
    }
    render() {
        let { oldpassword, password, c_password } = this.state
        return (
            <React.Fragment>
                <Container fluid>
                    <div className="page-title-box">
                        <Row className="align-items-center">
                            <Col sm="6">
                                <h4 className="page-title">CHANGE PASSWORD</h4>
                            </Col>
                            <Col sm="6">
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <AvForm onValidSubmit={() => this.onValidSubmit()}>
                                        <FormGroup row>
                                            <Label sm={2}>Old Password&nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={7}>
                                                <AvField name="oldpassword" type="password" value={oldpassword} maxLength={30}
                                                    onChange={e => this.onChange(e)} errorMessage="Enter Valid Old Password"
                                                    validate={{ required: { value: true } }} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={2}>New Password&nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={7}>
                                                <AvField name="password" type="password" value={password}
                                                    onChange={e => this.onChange(e)} errorMessage="Enter Valid Password" required
                                                    // validate={{ required: { value: true } }}
                                                    validate={{
                                                        pattern: { value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, errorMessage: 'Password must be one uppercase letter, one lower case letter,one number and one special character' }, maxLength: { value: 8, errorMessage: 'Your password should be  8 characters' },
                                                        minLength: { value: 8, errorMessage: 'Your password should be  8 characters' }
                                                    }} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={2}>Re-type Password&nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={7}>
                                                <AvField name="c_password" type="password" value={c_password}
                                                    onChange={e => this.onChange(e)} errorMessage=" Re-type the Above Password" required
                                                    validate={{
                                                        pattern: { value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, errorMessage: 'Password must be one uppercase letter, one lower case letter,one number and one special character' }, maxLength: { value: 8, errorMessage: 'Your password should be  8 characters' },
                                                        minLength: { value: 8, errorMessage: 'Your password should be  8 characters' }
                                                    }} />
                                            </Col>
                                        </FormGroup>
                                        <div >
                                            <Button>Submit</Button>
                                        </div>
                                    </AvForm>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}
const mapStateToProps = (state) => {
    return state.Login.user
}
export default connect(mapStateToProps, null)(ChangePassword)
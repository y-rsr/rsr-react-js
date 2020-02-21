import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, FormGroup, Button, Label } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { NotificationManager } from '../../components/ReactNotifications'
import request from '../../helpers/api';
import { getAdminAccess } from '../../helpers/authUtils';
class Add extends Component {
    state = {
        name: '',
        username: '',
        email: '',
        password: '',
        c_password: '',
        privileges: getAdminAccess(),
        checkall: false,
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
                        privileges: result.privileges
                    })
                    //check all privilegs array are disable or enable in menu action
                    this.checkAllvalue(result.privileges)
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    toggle = (e) => {
        let checked = e.target.checked
        let { privileges = [] } = this.state
        privileges.forEach(value => {
            value['view'] = checked ? true : false
            value['add'] = checked ? true : false
            value['edit'] = checked ? true : false
            value['delete'] = checked ? true : false
        })
        this.setState({ privileges, checkall: checked })

    }
    singelCheck = (e, name, index) => {
        let { privileges = [] } = this.state, checked = e.target.checked
        let tempaccess = privileges[index]
        tempaccess[name] = checked ? true : false
        privileges.splice(index, 1, tempaccess)
        this.setState({ privileges })
        //check all privilegs array are disable or enable in menu action
        this.checkAllvalue(privileges)
    }
    onValidsubmit = () => {
        let { name, email, username, password, c_password, privileges, rowid } = this.state
        let data = {
            email: email,
            name: name,
            username: username,
            privileges: privileges
        }
        if (!rowid) {
            data.password = password
        }

        if (c_password === password || rowid) {
            request({
                url: rowid ? `api/subadmin/${rowid}` : 'api/subadmin',
                method: rowid ? 'PUT' : 'POST',
                data
            }).then(res => {
                if (res && res.status === 200) {
                    NotificationManager.success(rowid ? 'Subadmin Updated Successfully' : 'Subadmin added Successfully', 'SUCCESS', 3000, null, null, 'filled', 'times-circle')
                    this.props.history.push('/admin/list')
                }
            }).catch(err => {
                if (err && err.status === 401) {
                    NotificationManager.error(err.data[0].msg, 'ERROR', 3000, null, null, 'filled', 'times-circle')
                } else if (err.status === 400) {
                    NotificationManager.error(err.data[0].msg, 'ERROR', 3000, null, null, 'filled', 'times-circle')
                }
            })
        } else {
            NotificationManager.error('Confirm password must be same as required password', 'ERROR', 3000, null, null, 'filled', 'times-circle')
            return
        }
    }
    checkAllvalue = (array) => {
        let checkall = true
        array.map((value) => {
            if (value.view === false || value.edit === false ||
                value.add === false || value.delete === false) {
                checkall = false
            }
            return true
        })
        if (checkall) {
            this.setState({ checkall: true })
        } else { this.setState({ checkall: false }) }
    }
    render() {
        let { name, email, username, password, c_password, privileges, rowid, checkall } = this.state
        return (
            <React.Fragment>
                <Container fluid>
                    <div className="page-title-box">
                        <Row className="align-items-center">
                            <Col sm="6">
                                <h4 className="page-title">{rowid ? 'EDIT SUBADMIN' : "ADD SUBADMIN"}</h4>
                            </Col>
                            <Col sm="6">
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <AvForm onValidSubmit={() => this.onValidsubmit()}>
                                        <FormGroup row>
                                            <Label sm={2}>Name&nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={7}>
                                                <AvField name="name" type="text" value={name} maxLength={30}
                                                    onChange={e => this.onChange(e)} errorMessage="Enter Valid Name"
                                                    validate={{ required: { value: true, } }} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={2}>Email&nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={7}>
                                                <AvField name="email" type="email" value={email}
                                                    onChange={e => this.onChange(e)} errorMessage="Enter Valid Email"
                                                    validate={{ required: { value: true } }} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={2}>Username&nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={7}>
                                                <AvField name="username" type="text" value={username}
                                                    onChange={e => this.onChange(e)} errorMessage="Enter Valid Username" required
                                                    validate={{
                                                        pattern: { value: /^[ A-Za-z0-9<>;_@./!%#^*()={}[\]'"?|~`&$+\\-]*$/ }
                                                    }} />
                                            </Col>
                                        </FormGroup>
                                        {!rowid && <><FormGroup row>
                                            <Label sm={2}>Password&nbsp;<span className='text-danger'>*</span></Label>
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
                                                <Label sm={2}>Confirm Password&nbsp;<span className='text-danger'>*</span></Label>
                                                <Col sm={7}>
                                                    <AvField name="c_password" type="password" value={c_password}
                                                        onChange={e => this.onChange(e)} errorMessage=" Re-type the Above Password" required
                                                        validate={{
                                                            pattern: { value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, errorMessage: 'Password must be one uppercase letter, one lower case letter,one number and one special character' }, maxLength: { value: 8, errorMessage: 'Your password should be  8 characters' },
                                                            minLength: { value: 8, errorMessage: 'Your password should be  8 characters' }
                                                        }} />
                                                </Col>
                                            </FormGroup></>}
                                        <FormGroup row >
                                            <Label sm={4}></Label>
                                            <Col sm={5}><input type='checkbox' style={{ cursor: 'pointer' }} checked={checkall} onChange={() => { }} onClick={(e) => { this.toggle(e) }} />Select All</Col>
                                        </FormGroup>
                                        <FormGroup row >
                                            <Label sm={2}>Management Name</Label>
                                            {/*  */}
                                            <Col sm={2}>View</Col>
                                            <Col sm={2}>Add </Col>
                                            <Col sm={2}>Edit </Col>
                                            <Col sm={2}>Delete</Col>
                                        </FormGroup>
                                        {privileges && privileges.map((value, index) => {
                                            return <FormGroup row key={index}><Label key={index} sm={2}>{value.access}</Label>
                                                <Col sm={2}>
                                                    <input type='checkbox' style={{ cursor: 'pointer' }} checked={value.view} onChange={() => { }} onClick={(e) => this.singelCheck(e, 'view', index)} />
                                                </Col>
                                                <Col sm={2}>
                                                    <input type='checkbox' style={{ cursor: 'pointer' }} checked={value.add} onChange={() => { }} onClick={(e) => this.singelCheck(e, 'add', index)} />
                                                </Col>
                                                <Col sm={2}>
                                                    <input type='checkbox' style={{ cursor: 'pointer' }} checked={value.edit} onChange={() => { }} onClick={(e) => this.singelCheck(e, 'edit', index)} />
                                                </Col>
                                                <Col sm={2}>
                                                    <input type='checkbox' style={{ cursor: 'pointer' }} checked={value.delete} onChange={() => { }} onClick={(e) => this.singelCheck(e, 'delete', index)} />
                                                </Col>
                                            </FormGroup>
                                        })}
                                        <div className='text-center'>
                                            <Button>Submit</Button>
                                        </div>
                                    </AvForm>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>

        );
    }
}
export default Add;
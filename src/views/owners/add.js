import React, { Component, Fragment } from 'react';
import { Container, Row, Col, Card, CardBody, FormGroup, Button, Input, TabContent, TabPane, Label, CustomInput, Nav, NavItem, NavLink } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { OngetImgSize } from '../../helpers/authUtils';
import _ from 'lodash'
import { NotificationManager } from '../../components/ReactNotifications';
import PlacesAutocomplete, {
    geocodeByAddress,
    // getLatLng,
} from 'react-places-autocomplete';
import request from '../../helpers/api';
class AddOwner extends Component {
    state = {
        rowid: _.get(this.props, 'location.state.rowid', false),
        activeTab: '1',
        name: '',
        password: '',
        email: '',
        c_password: '',
        mobile: '',
        achacnttype: 'savings',
        house: '',
        zip: '',
        street: '',
        achbank: '',
        achacntname: '',
        achaccount: '',
        achemail: '',
        achacntusage: 'business',
        loading: false,
        abanumber: ''
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
                    this.setState({
                        name: _.get(result, 'name', ''),
                        email: _.get(result, 'email', ''),
                        mobile: _.get(result, 'mobile', ''),
                        achacnttype: _.get(result, 'achacnttype', 'savings'),
                        house: _.get(result, 'house', ''),
                        zip: _.get(result, 'zip', ''),
                        address: _.get(result, 'street', ''),
                        street: _.get(result, 'street', ''),
                        achbank: _.get(result, 'achbank', ''),
                        achacntname: _.get(result, 'achacntname', ''),
                        achaccount: _.get(result, 'achaccount', ''),
                        achemail: _.get(result, 'achemail', ''),
                        achacntusage: _.get(result, 'achacntusage'),
                        abanumber: _.get(result, 'abanumber', ''),
                        userImage: _.get(result, 'userImage', ''),
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }
    toggle = (tab) => {
        this.setState({ activeTab: tab })
    }
    FileChange = (e) => {
        const file = _.get(e, "target.files.[0]", {}), setdata = this
        OngetImgSize(file, function (result) {
            let { width, height } = result
            if (width === 272 && height === 272) {
                setdata.setState({ imageFile: file, userImage: URL.createObjectURL(file) })
            } else {
                setdata.setState({ imageFile: file, userImage: '' })
                NotificationManager.error(`Uploaded Image Size not in 272 x 272 pixel`, 'ERROR', 3000, null, null, 'filled')
            }
        })
    }
    handleChange = address => {
        this.setState({ street: address, address });
    };
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    handleSelect = address => {
        this.setState({ street: address, address });
        geocodeByAddress(address)
            .then(results => {
                console.log(results)
                // getLatLng(results[0])
            })
        // .then(latLng => console.log('Success', latLng))
        // .catch(error => console.error('Error', error));
    };
    onValidSubmit = () => {
        let { rowid, name, password, email, c_password, mobile, house, zip, achbank, achacntname, achaccount, achacnttype, achemail, achacntusage, abanumber, imageFile, userImage,street } = this.state
        let data = new FormData()
        data.append("name", name)
        data.append("email", email)
        if (!rowid) data.append("password", password)
        if (mobile) data.append("mobile", mobile)
        data.append("street", street)
        data.append("house", house)
        if (zip) data.append("zip", zip)
        data.append("achbank", achbank)
        data.append("achacntname", achacntname)
        data.append("achaccount", achaccount)
        if (abanumber) data.append("abanumber", abanumber)
        if (achacnttype) data.append("achacnttype", achacnttype)
        if (achemail) data.append("achemail", achemail)
        data.append("achacntusage", achacntusage)
        if (imageFile) {
            data.append('imageFile', imageFile)
        } else {
            if(userImage)data.append('userImage', userImage)
        }
        if (rowid) {
            this.sendData(data)
        } else {
            if (c_password !== password) {
                NotificationManager.error('Confirm password must be same as required password', 'ERROR', 3000, null, null, 'filled', 'times-circle')
                return false
            } else {
                this.sendData(data)
            }
        }

    }
    sendData = (data) => {
        this.setState({ loading: true })
        let { rowid } = this.state
        request({
            url: rowid ? `api/owner/${rowid}/edit` : 'api/owner/create',
            method: rowid ? 'PUT' : 'POST',
            data
        }).then(res => {
            if (res && res.status === 200) {
                this.props.history.push('/admin/owner/list')
                this.setState({ loading: false })
                NotificationManager.success(res.data[0].msg, 'SUCCESS', 3000, null, null, 'filled')
            }
        }).catch(err => {
            this.setState({ loading: false })
            if (err && err.status === 400) {
                NotificationManager.error(err.data[0].msg, 'ERROR', 3000, null, null, 'filled')
            }
        })
    }
    render() {
        let { rowid, name, password, email, c_password, mobile, userImage, house, zip, achbank, achacntname, achaccount, achacnttype, achemail, achacntusage, loading, abanumber } = this.state
        return (
            <Fragment>
                <Container>
                    <div className="page-title-box">
                        <Row className="align-items-center">
                            <Col sm="8">
                                <h4 className="page-title">{rowid ? 'EDIT SUBADMIN' : "ADD NEW OWNER "}</h4>
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
                            <AvForm onValidSubmit={(e) => this.onValidSubmit(e)}>
                                <TabContent activeTab={this.state.activeTab} >
                                    <TabPane tabId="1" className="p-3">
                                        <FormGroup row>
                                            <Label sm={3} >Name &nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={6}>
                                                <AvField name='name' value={name} required errorMessage='Enter Valid Name' onChange={(e) => { this.onChange(e) }} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3} >Email &nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={6}>
                                                <AvField name='email' type='email' value={email} required errorMessage='Enter Valid Email' onChange={(e) => { this.onChange(e) }} />
                                            </Col>
                                        </FormGroup>
                                        {!rowid && <><FormGroup row>
                                            <Label sm={3} >Password &nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={6}>
                                                <AvField name='password' type='password' value={password} required errorMessage='Enter Valid Password' validate={{
                                                    pattern: { value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, errorMessage: 'Password must be one uppercase letter, one lower case letter,one number and one special character' }, maxLength: { value: 8, errorMessage: 'Your password should be  8 characters' },
                                                    minLength: { value: 8, errorMessage: 'Your password should be  8 characters' }
                                                }} onChange={(e) => { this.onChange(e) }} />
                                            </Col>
                                        </FormGroup>
                                            <FormGroup row>
                                                <Label sm={3} >Re-type Password &nbsp;<span className='text-danger'>*</span></Label>
                                                <Col sm={6}>
                                                    <AvField name='c_password' type='password' value={c_password} required errorMessage=" Re-type the Above Password" validate={{
                                                        pattern: { value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, errorMessage: 'Password must be one uppercase letter, one lower case letter,one number and one special character' }, maxLength: { value: 8, errorMessage: 'Your password should be  8 characters' },
                                                        minLength: { value: 8, errorMessage: 'Your password should be  8 characters' }
                                                    }} onChange={(e) => { this.onChange(e) }} />
                                                </Col>
                                            </FormGroup></>}
                                        <FormGroup row>
                                            <Label sm={3} >Mobile</Label>
                                            <Col sm={6}>
                                                <Input type='text' value={mobile} minLength={10} maxLength={10} name='mobile' onChange={(e) => { this.setState({ [e.target.name]: e.target.value.replace(/[^0-9]+/g, '') }) }}></Input>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}>User Image</Label>
                                            <Col sm={6}>
                                                <CustomInput type='file' id='image' onChange={(e) => this.FileChange(e)} />
                                                <span>(Image Size 272px X 272px)</span><br />
                                                {userImage && <img width='50px' src={userImage} alt='UserImage' />}
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}>Street</Label>
                                            <Col sm={6}>
                                                <PlacesAutocomplete
                                                    value={this.state.address || ''}
                                                    onChange={this.handleChange}
                                                    onSelect={this.handleSelect}
                                                >
                                                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                        <div>
                                                            <Input
                                                                {...getInputProps({
                                                                    placeholder: 'Search Places ...',
                                                                    className: 'location-search-input',
                                                                })} />
                                                            <div className="autocomplete-dropdown-container">
                                                                {loading && <div>Loading...</div>}
                                                                {suggestions.map(suggestion => {
                                                                    const className = suggestion.active
                                                                        ? 'suggestion-item--active'
                                                                        : 'suggestion-item';
                                                                    // inline style for demonstration purpose
                                                                    const style = suggestion.active
                                                                        ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                                        : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                                    return (
                                                                        <div
                                                                            {...getSuggestionItemProps(suggestion, {
                                                                                className,
                                                                                style,
                                                                            })}
                                                                        >
                                                                            <span>{suggestion.description}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </PlacesAutocomplete>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}>H/Apt No</Label>
                                            <Col sm={6}>
                                                <Input type='text' name={'house'} value={house} onChange={(e) => { this.onChange(e) }} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}>Zip</Label>
                                            <Col sm={6}>
                                                <Input type='text' name='zip' value={zip} maxLength={6} onChange={(e) => { this.setState({ [e.target.name]: e.target.value.replace(/[^0-9]+/g, '') }) }} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}></Label>
                                            <Col sm={6}>
                                                <p className='btn btn-success' onClick={() => this.toggle('2')}>Next</p>
                                            </Col>
                                        </FormGroup>
                                    </TabPane>
                                    <TabPane tabId="2" className="p-3">
                                        <FormGroup row>
                                            <Label sm={3}>Bank Name</Label>
                                            <Col sm={6}>
                                                <Input type='text' name='achbank' value={achbank} onChange={(e) => { this.onChange(e) }} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}>Account Name</Label>
                                            <Col sm={6}>
                                                <Input type='text' name='achacntname' value={achacntname} onChange={(e) => { this.onChange(e) }} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}>Account Number</Label>
                                            <Col sm={6}>
                                                <AvField type='text' name='achaccount' value={achaccount} onChange={(e) => { this.onChange(e) }} validate={{ pattern: { value: /[0-9]{9,18}/, errorMessage: 'InValid Account Number', }, maxLength: { value: 30 } }} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}>ABA Number</Label>
                                            <Col sm={6}>
                                                <Input type='text' name='abanumber' value={abanumber} onChange={(e) => { this.setState({ [e.target.name]: e.target.value.replace(/[^0-9]+/g, '') }) }} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}>Account Type</Label>
                                            <Col sm={6}>
                                                <select className='form-control' name='achacnttype' value={achacnttype} onChange={(e) => { this.onChange(e) }}>
                                                    <option value='savings'>Savings</option>
                                                    <option value='checking'>Checking</option>
                                                </select>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}>Paypal Email ID</Label>
                                            <Col sm={6}>
                                                <AvField type='email' name='achemail' value={achemail} validate={{
                                                    pattern: { value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, errorMessage: 'Enter Valid Paypal Email' }
                                                }} onChange={(e) => { this.onChange(e) }} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}>Account Usage</Label>
                                            <Col sm={6}>
                                                <select className='form-control' name='achacntusage' value={achacntusage} onChange={(e) => { this.onChange(e) }}>
                                                    <option value='business'>Business</option>
                                                    <option value='personal'>Personal</option>
                                                </select>
                                            </Col>
                                        </FormGroup>
                                        {!loading ? <Button color='success'>Submit</Button> :
                                            <Button color='success'><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading....</Button>}
                                    </TabPane>

                                </TabContent>
                            </AvForm>
                        </CardBody>
                    </Card>
                </Container>
            </Fragment >
        );
    }
}

export default AddOwner;
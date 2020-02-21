import React, { Component, Fragment } from 'react';
import { FormGroup, Col, Label, Form, Container, Row, Card, CardBody, Input, Button, NavItem, NavLink, Nav, TabPane, TabContent } from 'reactstrap'
import { NotificationManager } from '../../components/ReactNotifications';
import _ from 'lodash'
import request from '../../helpers/api';
import PlacesAutocomplete, { geocodeByAddress, } from 'react-places-autocomplete';
const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);
const passRegex = RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);
let temparray = ["Vehicles", "Deleted Cars", "Driver History", "Booking Documents", "Contract History", "Driver Dues", "Claims", "Gps"]
class LienAddEdit extends Component {
    state = {
        // rowids: '5e350cd757831b0640eb9d35',
        rowid: false,
        firstname: '',
        lastname: '',
        zip: '',
        city: '',
        password: '',
        c_password: '',
        mobile: '',
        email: '',
        state: '',
        country: '',
        loading: false,
        activeTab: '1',
        privileges: [],
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
                    this.setState({
                        firstname: _.get(result, 'firstname', ''),
                        lastname: _.get(result, 'lastname', ''),
                        house: _.get(result, 'house', ''),
                        zip: _.get(result, 'zip', ''),
                        city: _.get(result, 'city', ''),
                        street: _.get(result, 'street', ''),
                        mobile: _.get(result, 'mobile', ''),
                        email: _.get(result, 'email', ''),
                        country: _.get(result, 'country', ''),
                        state: _.get(result, 'state', ''),
                        privileges: _.get(result, 'privileges', ''),
                    })
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
    handleChange = address => {
        this.setState({ street: address, address, streetError: false });
    };
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
    onChange = (e, type, error) => {
        e.preventDefault();
        const { name, value } = e.target;
        switch (type) {
            case "firstname":
                this.setState({ firsnameError: value.length < 3 ? "minimum 3 characaters required" : "" })
                break;
            case "lastname":
                this.setState({ lastnamneError: value.length < 3 ? "minimum 3 characaters required" : "" })
                break;
            case "email":
                this.setState({
                    emailError: emailRegex.test(value)
                        ? ""
                        : "invalid email address"
                })
                break;
            case "normal":
                this.setState({ [error]: false })
                break;
            case "password":
                this.setState({
                    passwordError: passRegex.test(value)
                        ? ""
                        : "Password must be one uppercase letter, one lower case letter,one number and one special character", c_password: '',
                })
                break;
            case "c_password":
                this.setState({
                    c_passwordError: passRegex.test(value)
                        ? ""
                        : "Password must be one uppercase letter, one lower case letter,one number and one special character",
                })
                break;
            default:
                break;
        }

        this.setState({ [name]: value }, () => console.log(this.state));
    };
    touchInput = (name) => {
        let { firstname, lastname, city, password, email, state, street, country } = this.state
        switch (name) {
            case 'firstname':
                if (!firstname) {
                    this.setState({ firsnameError: 'Enter Valid First Name' })
                }
                break;
            case 'lastname':
                if (!lastname) {
                    this.setState({ lastnamneError: 'Enter Valid Last Name' })
                }
                break;
            case 'email':
                if (!email) {
                    this.setState({ emailError: 'Enter Valid Email' })
                }
                break;
            case 'street':
                if (!street) {
                    this.setState({ streetError: 'Enter valid street' })
                }
                break;
            case 'city':
                if (!city) {
                    this.setState({ cityError: 'Enter valid city' })
                }
                break;
            case 'state':
                if (!state) {
                    this.setState({ stateError: 'Enter valid state' })
                }
                break;
            case 'country':
                if (!country) {
                    this.setState({ countryError: 'Enter valid Country' })
                }
                break;
            case 'password':
                if (!password) {
                    this.setState({ passwordError: 'Enter valid Password' })
                }
                break;
            case 'c_password':
                if (!country) {
                    this.setState({ c_passwordError: 'Enter Confirm Password Same as Password' })
                }
                break;
            default:
                break;
        }
    }
    onSubmit = (e) => {
        e.preventDefault()
        let { firstname, lastname, zip, city, password, c_password, mobile, email, state, rowid, street, country, privileges } = this.state, formCheck = true
        if (!firstname) {
            this.setState({ firsnameError: 'Enter Valid First Name' })
            formCheck = false
        }
        if (!lastname) {
            this.setState({ lastnamneError: 'Enter Valid Last Name' })
            formCheck = false
        }
        if (!email) {
            this.setState({ emailError: 'Enter Valid Email' })
            formCheck = false
        }
        if (!mobile) {
            this.setState({ mobileError: 'Enter valid Mobile Number' })
            formCheck = false
        }
        if (!street) {
            this.setState({ streetError: 'Enter valid Street Number' })
            formCheck = false
        }
        if (!city) {
            this.setState({ cityError: 'Enter valid street' })
            formCheck = false
        }
        if (!state) {
            this.setState({ stateError: 'Enter valid street' })
            formCheck = false
        }
        if (!zip) {
            this.setState({ zipError: 'Enter valid zip code' })
            formCheck = false
        }
        if (!country) {
            this.setState({ countryError: 'Enter valid Country Name' })
            formCheck = false
        }
        if (!rowid && !password) {
            this.setState({ passwordError: 'Enter valid Password' })
            formCheck = false
        }
        if (!country) {
            this.setState({ c_passwordError: 'Enter Confirm Password Same as Password' })
            formCheck = false
        }
        if (mobile && mobile.toString().length !== 10) {
            formCheck = false
        }
        if (zip && zip.toString().length !== 6) {
            formCheck = false
        }
        if (email && !emailRegex.test(email)) {
            formCheck = false
        }
        if (!rowid && password && c_password && (password !== c_password)) {
            NotificationManager.error('Confirm password must be same as required password', 'ERROR', 3000, null, null, 'filled')
            formCheck = false
        }
        // for (let i = 1; i <= 12; i++) {
        //     if (document.getElementById(`id${i}`))
        //     if (document.getElementById(`id${i}`).value === '') {
        //         console.log(document.getElementById(`id${i}`).value)
        //         document.getElementById(`id${i}`).focus()
        //         return false
        //     }

        // }
        if (formCheck) {
            this.setState({ loading: true })
            request({
                url: rowid ? `api/lien/${rowid}` : 'api/lien',
                method: rowid ? 'PUT' : 'POST',
                data: {
                    firstname,
                    lastname,
                    zip,
                    city,
                    password,
                    mobile,
                    email,
                    state,
                    rowid,
                    street,
                    country,
                    privileges
                }
            }).then(res => {
                if (res && res.status === 200) {
                    this.setState({ loading: false })
                    NotificationManager.success(res.data[0].msg, 'ERROR', 3000, null, null, 'filled')
                }
            }).catch(err => {
                this.setState({ loading: false })
                if (err && err.status === 400) {
                    NotificationManager.error(err.data[0].msg, 'ERROR', 3000, null, null, 'filled')
                } else if (err && err.status === 401) {
                    NotificationManager.error(err.data[0].msg, 'ERROR', 3000, null, null, 'filled')
                }
            })
        }
    }
    toggle = (tab) => {
        this.setState({ activeTab: tab })
    }
    SelectAll = (e) => {
        let { checked } = e.target, privileges = []
        temparray.map(value => {
            if (document.getElementById(value)) {
                privileges.push(value)
                document.getElementById(value).checked = checked ? true : false
            }
            return true
        })
        this.setState({ privileges, checkall: checked })
    }
    singleCheck = e => {
        let { privileges } = this.state, { checked } = e.target
        if (checked) {
            privileges.push(e.target.id)
        } else {
            let index = privileges.indexOf(e.target.id)
            privileges.splice(index, 1)

        }
        this.setState({ privileges }, () => { if (privileges.length === temparray.length) { this.setState({ checkall: true }) } else { this.setState({ checkall: false }) } })
    }
    render() {
        let { firstname, lastname, zip, city, password, c_password, mobile, email, state, loading, firsnameError, lastnamneError, emailError, streetError, cityError, stateError, countryError, country, c_passwordError, passwordError, rowid, checkall } = this.state
        return (
            <Fragment>
                <Container fluid>
                    <div className='page-title-box'>
                        <Row className='align-items-center'>
                            <Col sm='8'>
                                <h4 className="page-title">ADD NEW LIEN</h4>
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
                                    <Form noValidate onSubmit={(e) => this.onSubmit(e)}>
                                        <TabContent activeTab={this.state.activeTab} >
                                            <TabPane tabId="1" className="p-3">
                                                <FormGroup row>
                                                    <Label sm={2}>First Name &nbsp;<span className='text-danger'>*</span></Label>
                                                    <Col sm={8}>
                                                        <Input type='text' id='id1' className={firsnameError ? 'is-invalid form-control' : ''} name='firstname' onBlur={() => this.touchInput('firstname')} value={firstname} onChange={e => this.onChange(e, 'firstname')} />
                                                        {firsnameError && <span className='invalid-feedback'>{firsnameError}</span>}
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Label sm={2}>Last Name &nbsp;<span className='text-danger'>*</span></Label>
                                                    <Col sm={8}>
                                                        <Input type='text' id='id2' className={lastnamneError ? 'is-invalid form-control' : ''} name='lastname' onBlur={() => this.touchInput('lastname')} value={lastname} onChange={e => this.onChange(e, 'lastname')} />
                                                        {lastnamneError && <span className='invalid-feedback'>{lastnamneError}</span>}
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Label sm={2}>Email Address &nbsp;<span className='text-danger'>*</span></Label>
                                                    <Col sm={8}>
                                                        <Input type='email' id='id3' className={emailError ? 'is-invalid form-control' : ''} name='email' onBlur={() => this.touchInput('email')} value={email} onChange={e => this.onChange(e, 'email')} />
                                                        {emailError && <span className='invalid-feedback'>{emailError}</span>}
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Label sm={2} >Mobile &nbsp;<span className='text-danger'>*</span></Label>
                                                    <Col sm={8}>
                                                        <Input type='text' id='id4' onBlur={() => {
                                                            if (!mobile) {
                                                                this.setState({ mobileError: 'Enter valid Mobile Number' })
                                                            }
                                                        }} value={mobile || ''} minLength={10} maxLength={10} name='mobile' onChange={(e) => {
                                                            var regex = /^[0-9\s]*$/;
                                                            if (regex.test(e.target.value)) {
                                                                this.setState({ [e.target.name]: e.target.value, mobileError: false }, () => {
                                                                    if (mobile.length + 1 !== 10) {
                                                                        this.setState({
                                                                            mobileError: 'Mobile number must be 10 digits'
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        }
                                                        } className={this.state.mobileError ? 'is-invalid form-control' : ''}></Input>
                                                        {this.state.mobileError && <span className='invalid-feedback'>{this.state.mobileError}</span>}
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Label sm={2}>Street&nbsp;<span className='text-danger'>*</span></Label>
                                                    <Col sm={8}>
                                                        <PlacesAutocomplete
                                                            value={this.state.street || ''}
                                                            onChange={this.handleChange}
                                                            onSelect={this.handleSelect}
                                                        >
                                                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                                <div>
                                                                    <Input
                                                                        {...getInputProps({
                                                                            placeholder: 'Search Places ...',
                                                                            className: 'location-search-input',
                                                                        })} name='street'
                                                                        id='id5'
                                                                        onBlur={() => this.touchInput('street')}
                                                                        className={streetError ? 'is-invalid form-control' : ''}

                                                                    />
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
                                                                    {streetError && <span className='invalid-feedback'>{streetError}</span>}
                                                                </div>
                                                            )}
                                                        </PlacesAutocomplete>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Label sm={2}>City &nbsp;<span className='text-danger'>*</span></Label>
                                                    <Col sm={8}>
                                                        <Input id='id6' type='text' name={'city'} value={city} onBlur={() => this.touchInput('city')} className={cityError ? 'is-invalid form-control' : ''} onChange={e => this.onChange(e, 'normal', 'cityError')} />
                                                        {cityError && <span className='invalid-feedback'>{cityError}</span>}
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Label sm={2}>State &nbsp;<span className='text-danger'>*</span></Label>
                                                    <Col sm={8}>
                                                        <Input id='id7' type='text' name={'state'} value={state} onBlur={() => this.touchInput('state')} className={stateError ? 'is-invalid form-control' : ''} onChange={e => this.onChange(e, 'normal', 'stateError')} />
                                                        {stateError && <span className='invalid-feedback'>{stateError}</span>}
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Label sm={2}>Zip &nbsp;<span className='text-danger'>*</span></Label>
                                                    <Col sm={8}>
                                                        <Input type='text' id='id8' onBlur={() => {
                                                            if (!zip) {
                                                                this.setState({ zipError: 'Enter valid zip code' })
                                                            }
                                                        }} value={zip || ''} minLength={6} maxLength={6} name='zip' onChange={(e) => {
                                                            var regex = /^[0-9\s]*$/;
                                                            if (regex.test(e.target.value)) {
                                                                this.setState({ [e.target.name]: e.target.value, zipError: false }, () => {
                                                                    if (zip.length + 1 !== 6) {
                                                                        this.setState({
                                                                            zipError: 'zip number must be 6 digits'
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        }
                                                        } className={this.state.zipError ? 'is-invalid form-control' : ''}></Input>
                                                        {this.state.zipError && <span className='invalid-feedback'>{this.state.zipError}</span>}
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Label sm={2}>Country &nbsp;<span className='text-danger'>*</span></Label>
                                                    <Col sm={8}>
                                                        <Input type='text' id='id9' name={'country'} value={country} onBlur={() => this.touchInput('country')} className={countryError ? 'is-invalid form-control' : ''} onChange={e => this.onChange(e, 'normal', 'countryError')} />
                                                        {countryError && <span className='invalid-feedback'>{countryError}</span>}
                                                    </Col>
                                                </FormGroup>
                                                {!rowid && <><FormGroup row>
                                                    <Label sm={2}>New Password  &nbsp;<span className='text-danger'>*</span></Label>
                                                    <Col sm={8}>
                                                        <Input type='password' id='id10' name={'password'} value={password} onChange={e => this.onChange(e, 'password')} onBlur={() => this.touchInput('password')} className={passwordError ? 'is-invalid form-control' : ''} maxLength='8' />
                                                        {passwordError && <span className='invalid-feedback'>{passwordError}</span>}
                                                    </Col>
                                                </FormGroup>
                                                    <FormGroup row>
                                                        <Label sm={2}>Re-type Password &nbsp;<span className='text-danger'>*</span></Label>
                                                        <Col sm={8}>
                                                            <Input type='password' id='id11' name='c_password' value={c_password} onChange={(e) => { this.onChange(e, 'c_password') }} onBlur={() => this.touchInput('c_password')} className={c_passwordError ? 'is-invalid form-control' : ''} maxLength='8' />
                                                            {c_passwordError && <span className='invalid-feedback'>{c_passwordError}</span>}
                                                        </Col>
                                                    </FormGroup></>}
                                            </TabPane>
                                            <TabPane tabId="2" className="p-3">
                                                <FormGroup row>
                                                    <Label sm='3'>Privileges</Label>
                                                    <Col>
                                                        <label>
                                                            <input type='checkbox' id='checkall' onChange={() => { }} checked={checkall} onClick={(e) => this.SelectAll(e)}></input>
                                                            Select All
                                                    </label>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Label sm='3'>Mangement Name</Label>
                                                    <Col>
                                                        <label>View</label>
                                                    </Col>
                                                </FormGroup>
                                                {temparray && temparray.map((value, index) => {
                                                    return <FormGroup key={index} row>
                                                        <Label sm='3'>{value}</Label>
                                                        <Col>
                                                            <input type='checkbox' id={value} onClick={(e) => this.singleCheck(e)} onChange={() => { }}></input>
                                                        </Col>
                                                    </FormGroup>
                                                })}
                                            </TabPane>
                                        </TabContent>
                                        {!loading ? <Button color='success'>Submit</Button> :
                                            <Button color='success'><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading....</Button>}
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        );
    }
}

export default LienAddEdit;
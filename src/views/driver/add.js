import React, { Component, Fragment } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation'
import { FormGroup, Col, Label, Container, Row, Card, CardBody, CustomInput, Input, Button } from 'reactstrap'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import { OngetImgSize } from '../../helpers/authUtils';
import { NotificationManager } from '../../components/ReactNotifications';
import _ from 'lodash'
import PlacesAutocomplete, {
    geocodeByAddress,
    // getLatLng,
} from 'react-places-autocomplete';
import request from '../../helpers/api';
class AddEdid extends Component {
    state = {
        rowid: '5e33cf0f22ce9b15fc933cf3',
        firstname: '',
        lastname: '',
        sponsor: '',
        house: '',
        zip: '',
        city: '',
        password: '',
        c_password: '',
        mobile: '',
        email: '',
        license: '',
        state: '',
        licexpdate: '',
        loading: false,
    };
    componentDidMount() {
        let { rowid } = this.state
        if (rowid)
            request({
                url: `api/driver/view/${rowid}`,
                method: 'GET'
            }).then(res => {
                if (res && res.status === 200) {
                    let result = res.data
                    this.setState({
                        firstname: _.get(result, 'firstname', ''),
                        lastname: _.get(result, 'lastname', ''),
                        sponsor: _.get(result, 'sponsor', ''),
                        house: _.get(result, 'house', ''),
                        zip: _.get(result, 'zip', ''),
                        city: _.get(result, 'city', ''),
                        userImage: _.get(result, 'userImage', ''),
                        street: _.get(result, 'street', ''),
                        mobile: _.get(result, 'mobile', ''),
                        email: _.get(result, 'email', ''),
                        license: _.get(result, 'license', ''),
                        state: _.get(result, 'state', ''),
                        licImage: _.get(result, 'licImage', ''),
                    })
                    if (result && result.licexpdate) {
                        this.setState({ licexpdate: new Date(result.licexpdate) })
                    }
                    if (result && result.dob) {
                        this.setState({ dob: new Date(result.dob) })
                    }
                }
            }).catch(err => {
                console.log(err)
            })
    }
    handleChangeDate(date, name) {
        this.setState({
            [name]: date
        });
    }
    FileChange = (e, name, ulrname) => {
        const file = _.get(e, "target.files.[0]", {}), setdata = this
        if (file) {
            OngetImgSize(file, function (result) {
                let { width, height } = result
                if (width === 272 && height === 272) {
                    setdata.setState({ [name]: file, [ulrname]: URL.createObjectURL(file) })
                } else {
                    setdata.setState({ imageFile: file, userImage: '' })
                    NotificationManager.error(`Uploaded Image Size not in 272 x 272 pixel`, 'ERROR', 3000, null, null, 'filled')
                }
            })
        }
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
        let { userImage, firstname, lastname, sponsor, house, zip, city, password, c_password, mobile, email, license, state, licImage, imageFile, street, dob, licexpdate, drivingLic, rowid } = this.state, formcheck = true
        if (mobile.length !== 10) {
            formcheck = false
        }
        if (zip.length !== 6) {
            formcheck = false
        }
        if (!rowid && password !== c_password) {
            formcheck = false
            NotificationManager.error('Confirm password must be same as required password', 'ERROR', 3000, null, null, 'filled')
        }
        if (formcheck) {
            this.setState({ loading: true })
            let data = new FormData()
            data.append('firstname', firstname)
            data.append('lastname', lastname)
            if (sponsor) data.append('sponsor', sponsor)
            data.append('street', street)
            data.append('house', house)
            data.append('city', city)
            data.append('zip', zip)
            data.append('email', email)
            if(!rowid)data.append('password', password)
            data.append('mobile', mobile)
            data.append('license', license)
            data.append('state', state)
            if (dob) data.append('dob', moment(dob).format('MM/DD/YYYY'))
            if (licexpdate) data.append('licexpdate', moment(licexpdate).format('MM/DD/YYYY'))
            if (imageFile) { data.append('imageFile', imageFile) } else { data.append("userImage", userImage) }
            if (drivingLic) { data.append('drivingLic', drivingLic) } else { data.append("licImage", licImage) }
            request({
                url: rowid ? `api/driver/${rowid}` : 'api/driver',
                method: rowid ? 'PUT' : 'POST',
                data
            }).then(res => {
                if (res && res.status === 200) {
                    this.setState({ loading: false })
                    NotificationManager.success(res.data[0].msg, 'SUCCESS', 3000, null, null, 'filled')
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
    render() {
        let { userImage, firstname, lastname, sponsor, house, zip, city, password, c_password, mobile, email, license, state, licImage, loading, rowid } = this.state
        const CustomInputDate = React.forwardRef((props, ref) => {
            return (
                <input
                    className={'yy'}
                    onClick={props.onClick}
                    value={props.value}
                    type="text"
                    readOnly={true}
                    ref={ref}
                />
            )
        })
        const maxDate = (input, days, months, years, type) => {
            var date = new Date(input);
            date.setDate(date.getDate() + days);
            date.setMonth(date.getMonth() + months);
            if (type === 'add') {
                date.setFullYear(date.getFullYear() + years);
            } else {
                date.setFullYear(date.getFullYear() - years);
            }
            return date;
        }
        return (
            <Fragment>
                <Container fluid>
                    <div className='page-title-box'>
                        <Row className='align-items-center'>
                            <Col sm='6'>
                                <h4 className="page-title">Add Driver</h4>
                            </Col>
                            <Col sm='6'></Col>
                        </Row>
                    </div>
                    <Row>
                        <Col sm='12'>
                            <Card>
                                <CardBody>
                                    <AvForm onValidSubmit={() => this.onValidSubmit()}>
                                        <FormGroup row>
                                            <Label sm='2'>First Name&nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={8}>
                                                <AvField name='firstname' value={firstname} required errorMessage='Enter Valld First Name' onChange={(e) => { this.onChange(e) }} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm='2'>Last Name&nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={8}>
                                                <AvField name='lastname' value={lastname} required errorMessage='Enter Valld Last Name' onChange={(e) => { this.onChange(e) }} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm='2'>Sponsor</Label>
                                            <Col sm={8}>
                                                <AvField name='sponsor' onChange={(e) => { this.onChange(e) }} value={sponsor} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm='2'>Date Of Birth</Label>
                                            <Col sm={8}>
                                                <DatePicker
                                                    customInput={<CustomInputDate />}
                                                    selected={this.state.dob}
                                                    dropdownMode="select"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    showDisabledMonthNavigation
                                                    disabledKeyboardNavigation
                                                    maxDate={maxDate(new Date(), 0, -1, 18)}
                                                    onChange={(date) => this.handleChangeDate(date, 'dob')}
                                                    placeholder={'Date of Birth'}
                                                // dateFormat={'DD/MM/YYYY'}
                                                />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm='2'>User Image</Label>
                                            <Col sm={8}>
                                                <CustomInput type='file' id='imagess' onChange={(e) => this.FileChange(e, 'imageFile', 'userImage')} />
                                                <span>(Image Size 272px X 272px)</span><br />
                                                {userImage && <img width='50px' src={userImage} alt='UserImage' />}
                                            </Col>
                                        </FormGroup>
                                        <h3>Address</h3>
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
                                                            <AvField
                                                                {...getInputProps({
                                                                    placeholder: 'Search Places ...',
                                                                    className: 'location-search-input',
                                                                })} name='street' required errorMessage='Enter Valid Street' />
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
                                            <Label sm={2}>H/Apt No &nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={8}>
                                                <AvField type='text' name={'house'} value={house} onChange={(e) => { this.onChange(e) }} required errorMessage='Enter Valid H/Apt no' />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={2}>City &nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={8}>
                                                <AvField type='text' name={'city'} value={city} onChange={(e) => { this.onChange(e) }} required errorMessage='Enter Valid City name' />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={2}>Zip &nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={8}>
                                                <Input type='text' onBlur={() => {
                                                    if (!zip) {
                                                        this.setState({ zipError: 'Enter valid zip code' })
                                                    }
                                                }} value={zip || ''} minLength={6} maxLength={6} name='zip' onChange={(e) => {
                                                    var regex = /^[0-9\s]*$/;
                                                    if (regex.test(e.target.value)) {
                                                        this.setState({ [e.target.name]: e.target.value, zipError: false }, () => {
                                                            if (zip.length + 1 !== 6) {
                                                                this.setState({
                                                                    zipError: 'Mobile number must be 6 digits'
                                                                })
                                                            }
                                                        })
                                                    }
                                                }
                                                } className={this.state.zipError ? 'is-invalid form-control' : ''}></Input>
                                                {this.state.zipError && <span className='invalid-feedback'>{this.state.zipError}</span>}
                                            </Col>
                                        </FormGroup>
                                        <h3>Contact Information</h3>
                                        <FormGroup row>
                                            <Label sm={2} >Email &nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={8}>
                                                <AvField name='email' type='email' value={email} required errorMessage='Enter Valid Email' onChange={(e) => { this.onChange(e) }} />
                                            </Col>
                                        </FormGroup>
                                        {!rowid && <><FormGroup row>
                                            <Label sm={2} >Password &nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={8}>
                                                <AvField name='password' type='password' value={password} required errorMessage='Enter Valid Password' validate={{
                                                    pattern: { value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, errorMessage: 'Password must be one uppercase letter, one lower case letter,one number and one special character' }, maxLength: { value: 8, errorMessage: 'Your password should be  8 characters' },
                                                    minLength: { value: 8, errorMessage: 'Your password should be  8 characters' }
                                                }} onChange={(e) => { this.onChange(e) }} />
                                            </Col>
                                        </FormGroup>
                                            <FormGroup row>
                                                <Label sm={2} >Re-type Password &nbsp;<span className='text-danger'>*</span></Label>
                                                <Col sm={8}>
                                                    <AvField name='c_password' type='password' value={c_password} required errorMessage=" Re-type the Above Password" validate={{
                                                        pattern: { value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, errorMessage: 'Password must be one uppercase letter, one lower case letter,one number and one special character' }, maxLength: { value: 8, errorMessage: 'Your password should be  8 characters' },
                                                        minLength: { value: 8, errorMessage: 'Your password should be  8 characters' }
                                                    }} onChange={(e) => { this.onChange(e) }} />
                                                </Col>
                                            </FormGroup></>}
                                        <FormGroup row>
                                            <Label sm={2} >Mobile &nbsp;<span className='text-danger'>*</span></Label>
                                            <Col sm={8}>
                                                <Input type='text' onBlur={() => {
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
                                        <h3>license Information</h3>
                                        <FormGroup row>
                                            <Label sm={2} >License Number</Label>
                                            <Col sm={8}>
                                                <Input name='license' type='text' value={license} onChange={(e) => this.onChange(e)} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={2} >Expiration Date</Label>
                                            <Col sm={8}>
                                                <DatePicker
                                                    customInput={<CustomInputDate />}
                                                    selected={this.state.licexpdate}
                                                    dropdownMode="select"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    showDisabledMonthNavigation
                                                    disabledKeyboardNavigation
                                                    minDate={maxDate(new Date(), 1, 0, 0)}
                                                    maxDate={maxDate(new Date(), 0, 0, 25, 'add')}
                                                    // maxDate={moment().subtract(18, "year")}
                                                    onChange={(date) => this.handleChangeDate(date, 'licexpdate')}
                                                    placeholder={'Date of Birth'}
                                                // dateFormat={'DD/MM/YYYY'}
                                                />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={2} >State</Label>
                                            <Col sm={8}>
                                                <Input name='state' type='text' value={state || ''} onChange={(e) => this.onChange(e)} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={2} >Background Check Status</Label>
                                            <Col sm={8}>
                                                <div className="checkbox">
                                                    <label>
                                                        <input type="checkbox" data-toggle="toggle" />
                                                        Option one is enabled
                                                    </label>
                                                </div>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={2} >Driving Licence</Label>
                                            <Col sm={8}>
                                                <CustomInput type='file' id='image' onChange={(e) => this.FileChange(e, 'drivingLic', 'licImage')} />
                                                <span>(Image Size 272px X 272px)</span><br />
                                                {licImage && <img width='50px' src={licImage} alt='UserImage' />}
                                            </Col>
                                        </FormGroup>
                                        {!loading ? <Button color='success'>Submit</Button> :
                                            <Button color='success'><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading....</Button>}
                                    </AvForm>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        );
    }
}

export default AddEdid;
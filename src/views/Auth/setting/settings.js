import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Col, Input, CustomInput } from 'reactstrap'
import _ from 'lodash'
import request from '../../../helpers/api';
import { NotificationManager } from '../../../components/ReactNotifications';
import { connect } from 'react-redux';
import { SetSiteInfo } from '../../../redux/actions';
class Setting extends Component {
    state = {
        username: '',
        email: '',
        sitename: '',
        bgimage: '',
        favicon: '',
        contactaddress: '',
        custtel: '',
        bookcartel: '',
        contactemail: '',
        financetel: '',
        financeemail: '',
        footer: '',
        appstoreurl: '',
        playstoreurl: '',
        fblink: '',
        twitterlink: '',
        instalink: '',
        min_day: '',
        refferalbonus: '',
        signupbonus: '',
        sitemode: '',
        nameError: false,
        emailError: false,
        siteError: false,
        footerError: false,
        logo: false,
        logoError: false,
        bgimgError: false,
        favError: false,
        loading: false,

    }
    onChange = (e, name) => {
        if (name) {
            this.setState({ [e.target.name]: e.target.value, [name]: false })
        } else {
            this.setState({ [e.target.name]: e.target.value })
        }
    }
    Filechange = (e, name, fileUrl, error) => {
        const file = _.get(e, "target.files.[0]", {});
        this.setState({
            [name]: file,
            [fileUrl]: URL.createObjectURL(file),
            [error]: false
        })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            username: _.get(nextProps, 'data.username', ''),
            email: _.get(nextProps, 'data.email', ''),
            sitename: _.get(nextProps, 'data.sitename', ''),
            logo: _.get(nextProps, 'data.logo', ''),
            bgimage: _.get(nextProps, 'data.bgimage', ''),
            favicon: _.get(nextProps, 'data.favicon', ''),
            footer: _.get(nextProps, 'data.footer', ''),
            contactaddress: _.get(nextProps, 'data.contactaddress', ''),
            custtel: _.get(nextProps, 'data.custtel', ''),
            bookcartel: _.get(nextProps, 'data.bookcartel', ''),
            contactemail: _.get(nextProps, 'data.contactemail', ''),
            financetel: _.get(nextProps, 'data.financetel', ''),
            financeemail: _.get(nextProps, 'data.financeemail', ''),
            appstoreurl: _.get(nextProps, 'data.appstoreurl', ''),
            playstoreurl: _.get(nextProps, 'data.playstoreurl', ''),
            fblink: _.get(nextProps, 'data.fblink', ''),
            twitterlink: _.get(nextProps, 'data.twitterlink', ''),
            instalink: _.get(nextProps, 'data.instalink', ''),
            min_day: _.get(nextProps, 'data.min_day', ''),
            refferalbonus: _.get(nextProps, 'data.refferalbonus', ''),
            signupbonus: _.get(nextProps, 'data.signupbonus', ''),
            sitemode: _.get(nextProps, 'data.sitemode', ''),
        })
    }
    AdminSubmit = (e) => {
        e.preventDefault()
        let { username, email, fblink, sitename, min_day, footer, refferalbonus, bgimage, contactaddress, custtel, bookcartel, financetel, financeemail, appstoreurl, playstoreurl, logo, contactemail, signupbonus, logoFile, favicon, twitterlink, instalink, sitemode, bgimageFile, faviconFile,
        } = this.state, formCheck = true
        if (!username) {
            this.setState({ nameError: 'Enter Valid Username' })
            formCheck = false
        }
        if (!email) {
            this.setState({ emailError: 'Enter Valid Email' })
            formCheck = false
        }
        if (!sitename) {
            this.setState({ siteError: 'Enter Valid Site Name' })
            formCheck = false
        }
        if (!footer) {
            this.setState({ footerError: 'Enter Valid Footer Name' })
            formCheck = false
        }
        if (!logo && _.isEmpty(logoFile)) {
            this.setState({ logoError: 'Choose Valid Logo' })
            formCheck = false
        }
        if (!bgimage && _.isEmpty(bgimageFile)) {
            this.setState({ bgimgError: 'Choose Valid Background Image' })
            formCheck = false
        }
        if (!favicon && _.isEmpty(faviconFile)) {
            this.setState({ favError: 'Choose Valid Favicon' })
            formCheck = false
        }
        if (formCheck) {
            this.setState({ loading: true })
            let data = new FormData()
            data.append('username', username)
            data.append('email', email)
            data.append('fblink', fblink)
            data.append('sitename', sitename)
            data.append('min_day', min_day)
            data.append('footer', footer)
            data.append('refferalbonus', refferalbonus)
            data.append('contactaddress', contactaddress)
            data.append('custtel', custtel)
            data.append('bookcartel', bookcartel)
            data.append('financetel', financetel)
            data.append('financeemail', financeemail)
            data.append('appstoreurl', appstoreurl)
            data.append('playstoreurl', playstoreurl)
            data.append('contactemail', contactemail)
            data.append('twitterlink', twitterlink)
            data.append('instalink', instalink)
            data.append('sitemode', sitemode)
            data.append('signupbonus', signupbonus)
            if (logoFile) {
                data.append('logoFile', logoFile)
            } else {
                data.append('logo', logo)
            }
            if (bgimageFile) {
                data.append('bgimageFile', bgimageFile)
            } else {
                data.append('bgimage', bgimage)
            }
            if (faviconFile) {
                data.append('faviconFile', faviconFile)
            } else {
                data.append('favicon', favicon)
            }
            request({
                url: 'api/admin/settings/admin',
                method: 'POST',
                data
            }).then(res => {
                if (res && res.status === 200) {
                    this.setState({ loading: false })
                    NotificationManager.success(res.data[0].msg, 'SUCCESS', 3000, null, null, 'filled')
                    request({
                        url: 'api/admin/siteinfo',
                        method: 'GET'
                    }).then(res => {
                        if (res && res.status === 200) {
                            this.props.SetSiteInfo(res.data)
                            window.location.reload()
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }
            }).catch(err => {
                this.setState({ loading: false })
                if (err && err.status === 400) {
                    NotificationManager.error(err.data[0].msg, 'ERROR', 3000, null, null, 'filled')
                }
            })
        }
    }
    render() {
        const { username, email, fblink, sitename, min_day, footer, refferalbonus, bgimage, contactaddress, custtel, bookcartel, financetel, financeemail, appstoreurl, playstoreurl, logo_name, logo, bgimage_name, contactemail, favicon_name, favicon, twitterlink, instalink, sitemode, signupbonus,
            nameError,
            emailError,
            siteError,
            footerError,
            logoError,
            bgimgError,
            favError,
            loading
        } = this.state;
        return (
            <Form noValidate onSubmit={(e) => this.AdminSubmit(e)}>
                <FormGroup row>
                    <Label sm={3}>Admin Login Username &nbsp;<span className='text-danger'>*</span></Label>
                    <Col sm={8}>
                        <Input type="text" name="username" className={nameError ? 'is-invalid form-control' : ''} value={username} placeholder="Enter Admin Login Username" onChange={(e) => this.onChange(e, 'nameError')} />
                        {nameError && <span className='invalid-feedback'>{nameError}</span>}
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>Email Address &nbsp;<span className='text-danger'>*</span></Label>
                    <Col sm={8}>
                        <Input type="email" name="email" value={email} placeholder="Enter admin email address" onChange={(e) => this.onChange(e, 'emailError')} className={emailError ? 'is-invalid form-control' : ''} />
                        {emailError && <span className='invalid-feedback'>{emailError}</span>}
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>Site Name &nbsp;<span className='text-danger'>*</span></Label>
                    <Col sm={8}>
                        <Input type="text" name="sitename" value={sitename} placeholder="Enter site title" onChange={(e) => this.onChange(e, 'siteError')} className={siteError ? 'is-invalid form-control' : ''} />
                        {siteError && <span className='invalid-feedback'>{siteError}</span>}
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>Logo</Label>
                    <Col sm={8}>
                        <CustomInput
                            id={"logo"}
                            onChange={(e, file) => this.Filechange(e, 'logoFile', 'logo', 'logoError')}
                            label={logo_name ? logo_name : "Choose Image"}
                            type="file"
                            name="logo"
                            className={logoError ? 'is-invalid form-control' : ''} />
                        {logoError && <span className='invalid-feedback'>{logoError}</span>}
                        {logo && <img width="50px" src={`${logo}`} alt="logoImage" />}
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>Background Image</Label>
                    <Col sm={8}>
                        <CustomInput
                            id={"bgimage"}
                            onChange={(e, file) => this.Filechange(e, 'bgimageFile', 'bgimage', 'bgimgError')}
                            label={bgimage_name ? bgimage_name : "Choose Image"}
                            type="file"
                            name="logo"
                            className={bgimgError ? 'is-invalid form-control' : ''} />
                        {bgimgError && <span className='invalid-feedback'>{bgimgError}</span>}
                        {bgimage && <img width="50px" src={`${bgimage}`} alt="Background" />}
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>Favicon &nbsp;<span className='text-danger'>*</span></Label>
                    <Col sm={8}>
                        <CustomInput
                            id={"favicon"}
                            onChange={(e, file) => this.Filechange(e, "faviconFile", 'favicon', 'favError')}
                            label={favicon_name ? favicon_name : "Choose Image"}
                            type="file"
                            name="favicon"
                            className={favError ? 'is-invalid form-control' : ''} />
                        {favError && <span className='invalid-feedback'>{favError}</span>}
                        {favicon && <img width="50px" src={`${favicon}`} alt="Favicon" />}
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>Footer Content &nbsp;<span className='text-danger'>*</span></Label>
                    <Col sm={8}>
                        <Input type="text" name="footer" value={footer} placeholder="Enter Footer Content" onChange={(e) => this.onChange(e)} className={footerError ? 'is-invalid form-control' : ''} />
                        {footerError && <span className='invalid-feedback'>{footerError}</span>}
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>Contact Address</Label>
                    <Col sm={8}>
                        <Input type="textarea" name="contactaddress" value={contactaddress} placeholder="Enter Contact Address" onChange={(e) => this.onChange(e)} />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>Contact Tel(Customer Service)</Label>
                    <Col sm={8}>
                        <Input type="tell" name="custtel" value={custtel} placeholder="Enter Contact Tel(Customer Service)" onChange={(e) => this.onChange(e)} />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>Contact Tel(Book a Car)</Label>
                    <Col sm={8}>
                        <Input type="tell" name="bookcartel" value={bookcartel} placeholder="Enter Contact Tel(Book a Car)" onChange={(e) => this.onChange(e)} />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>Contact E-mail</Label>
                    <Col sm={8}>
                        <Input type="email" name="contactemail" value={contactemail} placeholder="Enter Contact E-mail" onChange={(e) => this.onChange(e)} />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>Finance Tel</Label>
                    <Col sm={8}>
                        <Input type="tell" name="financetel" value={financetel} placeholder="Enter Finance Tel" onChange={(e) => this.onChange(e)} />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>Finance E-mail</Label>
                    <Col sm={8}>
                        <Input type="email" name="financeemail" value={financeemail} placeholder="Enter Finance E-mail" onChange={(e) => this.onChange(e)} />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>iOS - App Store URL</Label>
                    <Col sm={8}>
                        <Input type="text" name="appstoreurl" value={appstoreurl} placeholder="Enter iOS - App Store URL" onChange={(e) => this.onChange(e)} />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>Android - Play Store URL</Label>
                    <Col sm={8}>
                        <Input type="text" name="playstoreurl" value={playstoreurl} placeholder="Enter Android - Play Store URL" onChange={(e) => this.onChange(e)} />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>Facebook Link</Label>
                    <Col sm={8}>
                        <Input type="email" name="fblink" value={fblink} placeholder="Enter Facebook Link" onChange={(e) => this.onChange(e)} />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>Twitter Link</Label>
                    <Col sm={8}>
                        <Input type="text" name="twitterlink" value={twitterlink} placeholder="Enter Twitter Link" onChange={this.onChange} />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>Instagram Link</Label>
                    <Col sm={8}>
                        <Input type="text" name="instalink" value={instalink} placeholder="Enter Instagram Link" onChange={this.onChange} />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>Minimum No of Days Bookings</Label>
                    <Col sm={8}>
                        <Input type="number" name="min_day" value={min_day} placeholder="Enter Minimum No of Days Bookings" onChange={(e) => this.onChange(e)} />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>Referral Bonus</Label>
                    <Col sm={8}>
                        <Input type="number" name="refferalbonus" value={refferalbonus} placeholder="Enter Referral Bonus" onChange={(e) => this.onChange(e)} />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>Referral Signup Bonus</Label>
                    <Col sm={8}>
                        <Input type="number" name="signupbonus" value={signupbonus} placeholder="Enter Referral Signup Bonus" onChange={(e) => this.onChange(e)} />
                    </Col>
                </FormGroup>
                {/* <FormGroup row>
                    <Label sm={3}>Site Mode</Label>
                    <Col sm={1}>
                        <Input type="checkbox" name="sitemode" value={sitemode} placeholder="Enter Valid Sitemode" onChange={(e) => this.onChange(e)} />
                       
                    </Col>
                    <Col sm={1}>
                        <Input type="checkbox" name="sitemode" value={sitemode} placeholder="Enter Valid Sitemode" onChange={(e) => this.onChange(e)} />
                       
                    </Col>
                    <Col sm={1}>
                        <Input type="checkbox" name="sitemode" value={sitemode} placeholder="Enter Valid Sitemode" onChange={(e) => this.onChange(e)} />
                       
                    </Col>
                </FormGroup> */}
                <FormGroup row>
                    <Label className="d-block mb-3" sm={3}>Site Mode</Label>
                    <div className="custom-control custom-radio custom-control-inline">
                        <Input type="radio" id="customRadioInline1" name="sitemode" className="custom-control-input" onChange={() => { }} onClick={(e) => this.onChange(e)} value={'development'} checked={sitemode === 'development'} />
                        <Label className="custom-control-label" for="customRadioInline1">Development</Label>
                    </div>&nbsp;
                    <div className="custom-control custom-radio custom-control-inline">
                        <Input type="radio" id="customRadioInline2" name="sitemode" className="custom-control-input" onChange={() => { }} onClick={(e) => this.onChange(e)} value={'uat'} checked={sitemode === 'uat'} />
                        <Label className="custom-control-label" for="customRadioInline2">UAT </Label>
                    </div>
                    <div className="custom-control custom-radio custom-control-inline">
                        <Input type="radio" id="customRadioInline3" name="sitemode" className="custom-control-input" onChange={() => { }} onClick={(e) => this.onChange(e)} value={'production'} checked={sitemode === 'production'} />
                        <Label className="custom-control-label" for="customRadioInline3">Production </Label>
                    </div>
                </FormGroup>
                {!loading ? <Button color='success'>Submit</Button> :
                    <Button color='success'><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading....</Button>}
            </Form >
        );
    }
}

export default connect(null, { SetSiteInfo })(Setting);

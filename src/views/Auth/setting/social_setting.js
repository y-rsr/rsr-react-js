import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Col, Input } from 'reactstrap'
import _ from 'lodash'
import request from '../../../helpers/api';
import { NotificationManager } from '../../../components/ReactNotifications'
class Social_setting extends Component {
    state = {
        insurancekey: '',
        insurancepolicy: '',
        policysequence: '',
        s3bucketname: '',
        s3accesskey: '',
        s3secret: '',
        gsecretkey: '',
        gclientid: '',
        gredirecturl: '',
        gmapapikey: '',
        twiliophone: '',
        gdeveloperkey: '',
        twiliosid: '',
        twilioaccntauth: '',
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value.replace(/[^a-z0-9]/gi, '') })
    }
    SocialSubmit = (e) => {
        e.preventDefault()
        request({
            url: 'api/admin/settings/apikey',
            method: 'POST',
            data: this.state
        }).then(res => {
            if (res && res.status === 200) {
                NotificationManager.success(res.data[0].msg, 'SUCCESS', 3000, null, null, 'filled')
            }
        }).catch(err => {
            console.log(err)
        })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            insurancekey: _.get(nextProps, 'data.insurancekey', ''),
            insurancepolicy: _.get(nextProps, 'data.insurancepolicy', ''),
            policysequence: _.get(nextProps, 'data.policysequence', ''),
            s3bucketname: _.get(nextProps, 'data.s3bucketname', ''),
            s3accesskey: _.get(nextProps, 'data.s3accesskey', ''),
            s3secret: _.get(nextProps, 'data.s3secret', ''),
            gsecretkey: _.get(nextProps, 'data.gsecretkey', ''),
            gclientid: _.get(nextProps, 'data.gclientid', ''),
            gredirecturl: _.get(nextProps, 'data.gredirecturl', ''),
            gmapapikey: _.get(nextProps, 'data.gmapapikey', ''),
            twiliophone: _.get(nextProps, 'data.twiliophone', ''),
            gdeveloperkey: _.get(nextProps, 'data.gdeveloperkey', ''),
            twiliosid: _.get(nextProps, 'data.twiliosid', ''),
            twilioaccntauth: _.get(nextProps, 'data.twilioaccntauth', ''),
        })
    }
    render() {
        const { insurancekey, insurancepolicy, policysequence, s3bucketname, s3accesskey, s3secret, gsecretkey, gclientid, gredirecturl, gmapapikey, twiliophone, gdeveloperkey, twiliosid, twilioaccntauth } = this.state;
        return (
            <div>
                <Form noValidate onSubmit={(e) => this.SocialSubmit(e)}>
                    <FormGroup row>
                        <Label sm={3}>Insurance API Key</Label>
                        <Col sm={8}>
                            <Input type="text" maxLength={100} name="insurancekey" value={insurancekey} placeholder="Enter Facebook Link" onChange={(e) => this.onChange(e)} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>Insurance Policy Number</Label>
                        <Col sm={8}>
                            <Input type="text" maxLength={100} name="insurancepolicy" value={insurancepolicy} placeholder="Enter Google plus" onChange={(e) => this.onChange(e)} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>Insurance Policy Sequence</Label>
                        <Col sm={8}>
                            <Input type="text" maxLength={100} name="policysequence" value={policysequence} placeholder="Enter Youtube Link" onChange={(e) => this.onChange(e)} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>S3 Bucket Name </Label>
                        <Col sm={8}>
                            <Input type="text" maxLength={100} name="s3bucketname" value={s3bucketname} placeholder="Enter Twitter Link" onChange={(e) => this.onChange(e)} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>S3 Bucket Access Key </Label>
                        <Col sm={8}>
                            <Input type="text" maxLength={100} name="s3accesskey" placeholder="Enter Pintrest Link" value={s3accesskey} onChange={(e) => this.onChange(e)} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>S3 Bucket Secret Key </Label>
                        <Col sm={8}>
                            <Input type="text" maxLength={100} name="s3secret" value={s3secret} placeholder="Enter S3 Bucket Secret Key " onChange={(e) => this.onChange(e)} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>Google Client Id</Label>
                        <Col sm={8}>
                            <Input type="text" maxLength={100} name="gclientid" value={gclientid} placeholder="Enter Google Client Id" onChange={(e) => this.onChange(e)} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>Google Secret Key</Label>
                        <Col sm={8}>
                            <Input type="text" maxLength={100} name="gsecretkey" value={gsecretkey} placeholder="Enter Google Secret Key" onChange={(e) => this.onChange(e)} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>Google Developer Key</Label>
                        <Col sm={8}>
                            <Input type="text" maxLength={100} name="gdeveloperkey" value={gdeveloperkey} placeholder="Enter Google Developer Key" onChange={(e) => this.onChange(e)} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>Google Redirect Url</Label>
                        <Col sm={8}>
                            <Input type="text" maxLength={100} name="gredirecturl" value={gredirecturl} placeholder="Enter Google Redirect Url" onChange={(e) => this.onChange(e)} />
                            <span className="text-danger">
                                Note: For Google Redirect Url Copy This Url and Paste It. - http://rentals.zoplay.com/ridesharerental.com/googlelogin/googleRedirect
                                </span>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>Google Map API Key</Label>
                        <Col sm={8}>
                            <Input type="text" maxLength={100} name="gmapapikey" value={gmapapikey} placeholder="Enter Google Map API Key" onChange={(e) => this.onChange(e)} />
                            <span className="text-danger">
                                Note: For Google Redirect Url Copy This Url and Paste It. - http://rentals.zoplay.com/ridesharerental.com/dbbackup/fileUpload.php
                                </span>
                            <span className="text-danger">Note: Kindly Enable Drive API in APIs</span>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>Twilio Phone Number</Label>
                        <Col sm={8}>
                            <Input type="text" maxLength={100} name="twiliophone" value={twiliophone} placeholder="Enter Twilio Phone Number" onChange={(e) => this.onChange(e)} />
                            <span className="text-danger">Note: For Google Redirect Url Copy This Url and Paste It. - http://rentals.zoplay.com/ridesharerental.com/site/invitefriend/google_connect</span>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>Twilio Account SID</Label>
                        <Col sm={8}>
                            <Input type="text" maxLength={100} name="twiliosid" value={twiliosid} placeholder="Enter Facebook App ID" onChange={(e) => this.onChange(e)} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>Twilio Account Auth Token</Label>
                        <Col sm={8}>
                            <Input type="text" maxLength={100} name="twilioaccntauth" value={twilioaccntauth} placeholder="Enter Twilio Account Auth Token" onChange={(e) => this.onChange(e)} />
                        </Col>
                    </FormGroup>
                    {/* <FormGroup row>
                        <Label sm={3}>LinkedIn App ID</Label>
                        <Col sm={8}>
                            <Input type="text"  maxLength={100} name="linkedinappid" value={linkedinappid} placeholder="Enter LinkedIn App ID" onChange={(e) => this.onChange(e)} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>LinkedIn Secret Key</Label>
                        <Col sm={8}>
                            <Input type="text"  maxLength={100} name="linkedinkey" value={linkedinkey} placeholder="Enter LinkedIn Secret Key" onChange={(e) => this.onChange(e)} />
                        </Col>
                    </FormGroup> */}
                    <Button>Submit</Button>
                </Form>
            </div>
        );
    }
}

export default Social_setting;
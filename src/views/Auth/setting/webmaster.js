import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Col, Input } from 'reactstrap'
import request from '../../../helpers/api'
import _ from 'lodash'
import { NotificationManager } from '../../../components/ReactNotifications'
class Webmaster extends Component {
    constructor(props) {
        super(props)
        this.state = {
            metatitle: '',
            metakeyword: '',
            metadescription: '',
            chatcode: '',
            analyticscode: '',
            verificationcode: '',
            scripts: ''
        }
    }

    // componentDidMount() {
    //     request({
    //         url: 'api/admin/settings',
    //         method: 'GET'
    //     }).then(res => {
    //         if (res && res.status === 200) {
    //             let result = _.get(res, 'data.1', false)
    //             this.setState({
    //                 metatitle: result.metatitle,
    //                 metakeyword: result.metakeyword,
    //                 metadescription: result.metadescription,
    //                 chatcode: result.chatcode,
    //                 analyticscode: result.analyticscode,
    //                 verificationcode: result.verificationcode,
    //                 scripts: result.scripts,
    //             })
    //         }
    //     }).catch(err => {
    //         console.log(err)
    //     })
    // }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    onSubmit = (e) => {
        e.preventDefault()
        request({
            url: 'api/admin/settings/webmaster',
            method: 'POST',
            data: this.state
        }).then(res => {
            if (res && res.status === 200) {
                NotificationManager.success(res.data[0].msg, 'SUCCESS', 3000, null, null, 'filled')
            }
        }).catch(err => {
            console.log('webmastererror', err)
        })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            metatitle: _.get(nextProps, 'data.metatitle', ''),
            metakeyword: _.get(nextProps, 'data.metakeyword', ''),
            metadescription: _.get(nextProps, 'data.metadescription', ''),
            chatcode: _.get(nextProps, 'data.chatcode', ''),
            analyticscode: _.get(nextProps, 'data.analyticscode', ''),
            verificationcode: _.get(nextProps, 'data.verificationcode', ''),
            scripts: _.get(nextProps, 'data.verificationcode', '')
        })
    }
    render() {
        const { metatitle, metakeyword, metadescription, chatcode, analyticscode, verificationcode, scripts } = this.state;
        return (
            <div>
                <Form noValidate onSubmit={(e) => this.onSubmit(e)}>
                    <h4>Search Engine Information</h4>
                    <FormGroup row>
                        <Label sm={3}>Meta Title</Label>
                        <Col sm={9}>
                            <Input type="text" maxLength={65} name="metatitle" value={metatitle} placeholder="Enter Meta Title" onChange={this.onChange} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>Meta Keyword</Label>
                        <Col sm={9}>
                            <Input type="text"  maxLength={255} name="metakeyword" value={metakeyword} placeholder="Enter Meta Keyword" onChange={this.onChange} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>Meta Description</Label>
                        <Col sm={9}>
                            <Input type="textarea"  maxLength={255} rows="4" cols="50" name="metadescription" value={metadescription} placeholder="Enter Meta Description" onChange={this.onChange} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>Live Chat Code</Label>
                        <Col sm={9}>
                            <Input type="textarea" name="chatcode" value={chatcode} placeholder="Enter Live Chat Code" onChange={this.onChange} />
                        </Col>
                    </FormGroup>
                    <h4>Google Webmaster Info</h4>
                    <FormGroup row>
                        <Label sm={3}>Google Analytics Code</Label>
                        <Col sm={9}>
                            <Input type="textarea" name="analyticscode" value={analyticscode} placeholder="Copy Google Analytics Code and Paste Here" onChange={this.onChange} />
                            <span>
                                For Examples:
                                <pre>{`<script type="text/javascript"
                                    var _gaq = _gaq || [];
                                    _gaq.push([_setAccount, UA-XXXXX-Y]);
                                    _gaq.push([_trackPageview]);
                                    (function() {
                                        var ga = document.createElement(script); ga.type = text/javascript; ga.async = true;
                                        ga.src = (https: == document.location.protocol ? https://ssl : http://www) + .google-analytics.com/ga.js;
                                    var s = document.getElementsByTagName(script)[0]; s.parentNode.insertBefore(ga, s);
                                    })();
                                </script>`}</pre>
                            </span>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>Google HTML Meta Verification Code</Label>
                        <Col sm={9}>
                            <Input type="text" name="verificationcode" value={verificationcode} placeholder="Google HTML Meta Verifcation Code" onChange={this.onChange} />
                            <pre>
                                <span >Google Webmaster Verification using Meta tag.</span>
                                <span><pre>For more reference: <a target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }} href="https://support.google.com/webmasters/answer/35638#3">https://support.google.com/webmasters/answer/35638#3</a></pre></span>
                            </pre>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm={3}>Other Scripts</Label>
                        <Col sm={9}>
                            <Input type="textarea" name="scripts" value={scripts} placeholder="Enter Other Script" onChange={this.onChange} />
                        </Col>
                    </FormGroup>
                    <Button>Submit</Button>
                </Form>

            </div >
        );
    }
}

export default Webmaster;
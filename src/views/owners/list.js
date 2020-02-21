import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader, Button, ModalHeader, Modal, ModalBody, UncontrolledTooltip } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation'
import { Link } from 'react-router-dom'
import request, { NodeURL } from '../../helpers/api';
import { NotificationManager } from '../../components/ReactNotifications';
import SweetAlert from 'react-bootstrap-sweetalert';
import { GetPagniationArray, AccessCheckViewMenu } from '../../helpers/authUtils';
import { get } from 'lodash'
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from 'moment'
class OwnerList extends Component {
    state = {
        tableData: [],
        search: '',
        currPage: 10,
        page: 1,
        bulk: [],
        count: 0,
        total: 0,
        loading: true,
        sortOrder: false,
        modalOpen: false,
        tableOptions: {
            skip: 0,
            limit: 10,
            page: {
                history: '',
                current: 1
            },
            order: -1,
            field: 'status',
        },
        ownerstatus: 'active'
    }
    componentDidMount() {
        let { tableOptions, ownerstatus } = this.state
        request({
            url: `api/owner/${ownerstatus}`,
            method: 'POST',
            data: tableOptions
        }).then(res => {
            if (res && res.status === 200 && res.data) {
                this.setState({
                    tableData: res.data.docList,
                    total: res.data.docCount,
                    currPage: res.data.docList.length,
                    loading: false
                })
            } else {
                this.setState({
                    tableData: [],
                    total: 0,
                    currPage: 0,
                    loading: false
                })
            }
        }).catch(err => {
            this.setState({
                tableData: [],
                total: 0,
                currPage: 0,
                loading: false
            })
        })
    }
    search = (e, type) => {
        document.getElementById('checkall').checked = false
        let value = e.target.value
        if (type) {
            this.setState({ ownerstatus: value, loading: true, tableData: [] }, () => this.componentDidMount())
        } else {
            if (value !== '') {
                this.setState(function (state) {
                    state.tableOptions.search = value;
                    this.componentDidMount();
                });
            } else {
                let { tableOptions } = this.state
                delete tableOptions['search']
                this.setState({ tableOptions: tableOptions }, () => this.componentDidMount())
            }
        }
    }
    sort = (e, field) => {
        var sorticondef = 'fas fa-sort';
        var id = ["name", "email", "mobile", "openhours", "emailVerified", "phoneVerified", "insurance", "maintenance", "cars", "status", 'created'];
        for (let i in id) {
            document.getElementById(id[i]).className = sorticondef;
        }
        this.setState(function (state) {
            state.sortOrder = !state.sortOrder;
        });
        this.setState(function (state) {
            state.tableOptions.order = state.sortOrder ? 1 : -1;
            state.tableOptions.field = field;
            this.componentDidMount();
        });
    }
    checkall(id, len) {
        let c = document.getElementById(id);
        let val = [];
        if (c.checked) {
            this.setState({ count: len });
            for (let i = 0; i < len; i++) {
                if (document.getElementById(i)) {
                    document.getElementById(i).checked = true;
                    val.push(document.getElementById(i).value);
                }
            }
            this.setState({ bulk: val });
        } else {
            this.setState({ count: 0 });
            for (let i = 0; i < len; i++) {
                if (document.getElementById(i)) {
                    document.getElementById(i).checked = false;
                }
            }
            this.setState({ bulk: [] });
        }
    }
    checkbox(index, id) {
        let c = document.getElementById(index);
        let ca = document.getElementById('checkall');
        let count = this.state.count;
        let len = this.state.currPage;
        let bulk = this.state.bulk;
        if (c.checked === true) {
            count++;
            bulk.push(id);
            this.setState({ count, bulk });
        } else {
            count--;
            let i = bulk.indexOf(id);
            bulk.splice(i, 1);
            this.setState({ count, bulk });
        }
        if (count === len) {
            ca.checked = true;
            this.checkall('checkall', len);
        } else {
            ca.checked = false;
        }
    }
    onAction = (type, id, value, name) => {
        this.setState({ confirm_both: false })
        switch (type) {
            case 'view':
                this.props.history.push({
                    pathname: `/admin/owner/view`,
                    state: { rowid: id }
                });
                break;
            case 'edit':
                this.props.history.push({
                    pathname: `/admin/owner/add`,
                    state: { rowid: id }
                });
                break;
            case 'password':
                this.setState({ modalOpen: true, admin_id: id })
                break;
            case 'status':
                request({
                    url: `api/owner/update/property/${id}`,
                    method: 'POST',
                    data: {
                        field: value
                    }
                }).then(res => {
                    if (res && res.status === 200) {
                        NotificationManager.success('Status Updated Successfully', 'SUCCESS', 3000, null, null, 'filled', 'check-circle')
                        this.componentDidMount()
                    }
                }).catch(err => {
                    if (err && err.status === 400) {
                        this.setState({ confirm_both: false })
                        NotificationManager.error(err.data[0].msg, 'ERROR', 3000, null, null, 'filled', 'check-circle')
                    }
                })
                break;
            case 'delete':
                request({
                    url: `api/owner/${id}`,
                    method: 'DELETE'
                }).then(res => {
                    if (res && res.status === 200) {
                        this.setState({ success_dlg: false })
                        this.componentDidMount()
                        NotificationManager.success('Deleted SuccessFully', 'Success', 3000, null, null, 'filled', 'check-circle')
                    }
                }).catch(err => {
                    console.log('error', err)
                })
                break;
            case 'export':
                request({
                    url: id,
                    method: value === 'ownerAgreement' ? 'POST' : 'GET',
                    data: {
                        name: name
                    }
                }).then(res => {
                    if (res && res.status === 200) {
                        let url = value === 'ownerAgreement' ? '/api/download/agreement/pdf?filepath=' : '/api/owner/list/export?filepath='
                        window.open(`${NodeURL}${url}${res.data[0].filepath}`, '__blank');
                    }
                }).catch(err => {
                    if (err && err.status === 400) {
                        NotificationManager.error(err.data[0].msg, 'ERROR', 3000, null, null, 'filled')
                    }
                })
                break;
            case 'BulkStatus':
                request({
                    url: '/api/owner',
                    method: 'PUT',
                    data: {
                        field: id,
                        value: value,
                        user: name
                    }
                }).then(res => {
                    if (res && res.status === 200) {
                        NotificationManager.success('Status Updated Successfully', 'SUCCESS', 3000, null, null, 'filled', 'check-circle')
                        this.clearCheckBox()
                        this.componentDidMount()
                    }
                }).catch(err => {
                    this.clearCheckBox()
                    if (err && err.status === 400) {
                        NotificationManager.error(err.data[0].msg, 'ERROR', 3000, null, null, 'filled')
                    }
                })
                break;
            case 'BulkDelete':
                let url = 'api/owner?'
                name.map((value) => {
                    if (name.length === 1) {
                        url = `${url}id=${value}`
                    } else {
                        url = `${url}id=${value}&`
                    }
                    return true
                })
                request({
                    url: url,
                    method: 'DELETE',
                }).then(res => {
                    if (res && res.status === 200) {
                        this.componentDidMount()
                        this.clearCheckBox()
                        NotificationManager.success('Deleted Successfully', 'SUCCESS', 3000, null, null, 'filled', 'check-circle')
                    }
                }).catch(err => {
                    console.log(err)
                })
                break;
            default:
        }
    }
    ChangeLimit = e => {
        let page = e.target.value
        document.getElementById('checkall').checked = false;
        for (let i = 0; i < this.state.currPage; i++) {
            if (document.getElementById(i)) {
                document.getElementById(i).checked = false;
            }
        }
        this.setState(function (state) {
            state.tableOptions.limit = parseInt(page, 10);
            state.tableOptions.skip = 0;
            state.tableOptions.page.history = 1;
            state.tableOptions.page.current = 1;
            state.count = 0;
            state.bulk = [];
        });
        this.componentDidMount();
    }
    Pagination = (data) => {
        let history = this.state.tableOptions.page.history;
        let limit = this.state.tableOptions.limit;
        var len = Math.ceil(this.state.total / limit);
        if (data === "Prev") {
            if (history === '') {
                this.clearCheckBox()
                this.setState(function (state) {
                    state.tableOptions.page.current = 1;
                    state.tableOptions.page.history = 1;
                    state.tableOptions.skip = 0;
                    state.count = 0;
                    state.bulk = [];
                    document.getElementById('checkall').checked = false;
                    this.componentDidMount();
                });
            } else {
                this.clearCheckBox()
                this.setState(function (state) {
                    let set = history - 1;
                    if (set >= 1) {
                        state.tableOptions.page.current = set;
                        state.tableOptions.page.history = set;
                        state.tableOptions.skip = set * limit - limit;
                        state.bulk = [];
                        state.count = 0;
                        document.getElementById('checkall').checked = false;
                        this.componentDidMount();
                    } else {
                        state.tableOptions.page.current = 1;
                        state.tableOptions.page.history = 1;
                        state.tableOptions.skip = 0;
                        state.bulk = [];
                        state.count = 0;
                        document.getElementById('checkall').checked = false;
                        this.componentDidMount();
                    }
                });
            }
        } else if (data === "Next") {
            if (history === '') {
                this.clearCheckBox()
                this.setState(function (state) {
                    if (this.state.total <= limit) {
                        state.tableOptions.page.current = 1;
                        state.tableOptions.page.history = 1;
                        state.tableOptions.skip = 0;
                        state.bulk = [];
                        state.count = 0;
                        document.getElementById('checkall').checked = false;
                        this.componentDidMount();
                    } else {
                        state.tableOptions.page.current = 2;
                        state.tableOptions.page.history = 2;
                        state.tableOptions.skip = 2 * limit - limit;
                        state.bulk = [];
                        state.count = 0;
                        document.getElementById('checkall').checked = false;
                        this.componentDidMount();
                    }
                });
            } else {
                this.clearCheckBox()
                this.setState(function (state) {
                    let set = history + 1;
                    if (set <= len) {
                        state.tableOptions.page.current = set;
                        state.tableOptions.page.history = set;
                        state.tableOptions.skip = set * limit - limit;
                        state.bulk = [];
                        state.count = 0;
                        document.getElementById('checkall').checked = false;
                        this.componentDidMount();
                    } else {
                        state.tableOptions.page.current = len;
                        state.tableOptions.page.history = len;
                        state.tableOptions.skip = len * limit - limit;
                        state.bulk = [];
                        state.count = 0;
                        document.getElementById('checkall').checked = false;
                        this.componentDidMount();
                    }
                });
            }
        } else {
            this.clearCheckBox()
            this.setState(function (state) {
                if (history === '') {
                    state.tableOptions.page.current = data;
                    state.tableOptions.page.history = data;
                    state.tableOptions.skip = data * limit - limit;
                    this.componentDidMount();
                } else if (history === data) {
                    state.tableOptions.page.current = data;
                    state.tableOptions.page.history = data;
                    state.tableOptions.skip = data * limit - limit;
                    this.componentDidMount();
                } else {
                    state.tableOptions.page.current = data;
                    state.tableOptions.page.history = data;
                    state.tableOptions.skip = data * limit - limit;
                    state.bulk = [];
                    state.count = 0;
                    document.getElementById('checkall').checked = false;
                    this.componentDidMount();
                }
            });
        }
    }
    onValidSubmit = () => {
        let { password, c_password, admin_id } = this.state
        if (password === c_password) {
            request({
                url: `api/owner/change/password/${admin_id}`,
                method: 'PUT',
                data: {
                    password: password
                }
            }).then(res => {
                if (res && res.status === 200) {
                    NotificationManager.success('Password Updated Successfully', 'Success', 3000, null, null, 'filled')
                    this.setState({ admin_id: '', modalOpen: false, c_password: '', password: '' })
                }
            }).catch(err => {
                console.log(err)
            })
        } else {
            NotificationManager.error('Confirm password must be same as required password', 'ERROR', 3000, null, null, 'filled', 'times-circle')
            return
        }
    }
    checkPop = (type, id, value, name) => {
        if (type === 'BulkStatus' || type === 'BulkDelete') {
            let { bulk } = this.state
            if (bulk.length > 0) {
                this.setState({ confirm_both: { type, id, value, name: bulk } })
            } else {
                this.clearCheckBox()
                NotificationManager.error('Nothing Selected To Perform', 'ERROR', 3000, null, null, 'filled', 'times-circle')
            }
        } else {
            this.setState({ confirm_both: { type, id, value, name } })
        }
    }
    clearCheckBox = () => {
        document.getElementById('checkall').checked = false;
        for (let i = 0; i < this.state.currPage; i++) {
            if (document.getElementById(i)) {
                document.getElementById(i).checked = false;
            }
        }
        this.setState(function (state) {
            state.count = 0;
            state.bulk = [];
        })
    }
    find = (from, to) => {
        this.setState(prevState => {
            let tableOptions = Object.assign({}, prevState.tableOptions);
            tableOptions.start = from;
            tableOptions.end = to;
            return { tableOptions };
        }, () => {
            if (!from && !to) {
                let { tableOptions } = this.state
                delete tableOptions['start']
                delete tableOptions['end']
                this.setState({ tableOptions }, () => this.componentDidMount())
            } else {
                if (from && to) {
                    this.componentDidMount()
                }
            }
        })
    }
    render() {
        const { tableData, total, sortOrder, loading, tableOptions, modalOpen, ownerstatus, confirm_both } = this.state
        var sorticondef = 'fas fa-sort', { Access, Admintype } = this.props
        var sorticon = `fas fa-sort${sortOrder === null ? '' : sortOrder === true ? '-amount-up' : '-amount-down'}`;
        if (tableOptions.field) {
            if (document.getElementById(tableOptions.field)) {
                document.getElementById(tableOptions.field).className = sorticon;
            }
        }
        let page = tableOptions.page.current, { start, end, skip } = tableOptions
        const pagecount = GetPagniationArray(total, tableOptions.page.current, tableOptions.limit)
        let checkprivilegsEdit = AccessCheckViewMenu(Access, Admintype, 'edit')
        return (
            <React.Fragment>
                <Container fluid>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader >
                                    <Row>
                                        <Col lg='6'>
                                            Owner List
                                        </Col>
                                        <Col lg='6' >
                                            <div className='bulkaction'>
                                                {checkprivilegsEdit && <>
                                                    <Button onClick={e => this.checkPop('BulkStatus', 'status', 'ACTIVE')}>
                                                        <i className='fas fa-check-circle text-success' />
                                                        Active
                                                    </Button>
                                                    <Button onClick={e => this.checkPop('BulkStatus', 'status', 'INACTIVE')}>
                                                        <i className='fas fa-ban text-danger' />
                                                        In-Active
                                                    </Button>
                                                </>
                                                }
                                                {
                                                    AccessCheckViewMenu(Access, Admintype, 'delete') && <Button onClick={e => this.checkPop('BulkDelete')}>
                                                        <i className='fas fa-times-circle text-danger' />
                                                        Delete
                                                </Button>
                                                }
                                                {
                                                    AccessCheckViewMenu(Access, Admintype, 'add') && <Link to='/admin/owner/add'>
                                                        <Button color='success'>
                                                            <i className='fas fa-plus-circle text-danger' />
                                                            Add
                                                </Button>
                                                    </Link>
                                                }
                                                <Button color='warning' onClick={(e) => this.onAction('export', `api/owner/list/export/${ownerstatus}`)}>
                                                    <i className='fa fa-download' />
                                                    Export All
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <div className='row d-flex'>
                                        <div className=' col-md-2 '>
                                            <label>
                                                Search
                                            <input type='search' value={tableOptions.search || ''} onChange={e => this.search(e)} className='form-control form-control-sm' placeholder='Search' />
                                            </label>
                                        </div>
                                        <div className='col-md-2 '>
                                            <label>
                                                Status
                                            <select type='text' value={ownerstatus} onChange={e => this.search(e, 'true')} className='form-control form-control-sm' placeholder='Search' >
                                                    <option value='active'>Active</option>
                                                    <option value='inactive'>Inactive</option>
                                                    <option value='all'>All</option>
                                                </select>
                                            </label>
                                        </div>
                                        <div className='col-md-6'>
                                            <DateRangePicker
                                                showClearDates={true}
                                                startDate={start || undefined}
                                                startDateId="start"
                                                endDate={end || undefined}
                                                endDateId="end"
                                                onDatesChange={({ startDate, endDate }) => {
                                                    this.find(startDate, endDate)

                                                }}
                                                isOutsideRange={(day) => day.isAfter(moment())}
                                                focusedInput={this.state.focusedInput}
                                                onFocusChange={focusedInput => this.setState({ focusedInput })}
                                                displayFormat="DD-MM-YYYY"
                                            />
                                        </div>
                                        <div className='col-md-2'>
                                            <label>
                                                Entries per page
                                            <select onChange={e => this.ChangeLimit(e)} className='custom-select custom-select-sm form-control form-control-sm' >
                                                    <option>10</option>
                                                    <option>25</option>
                                                    <option>50</option>
                                                </select>
                                            </label>
                                        </div>
                                    </div>
                                    <div className='table-responsive'>
                                        <table className='table table-striped table-hover mb-0'>
                                            <thead>
                                                <tr>
                                                    <th colSpan="1" rowSpan="1">
                                                        <input
                                                            type='checkbox'
                                                            id='checkall'
                                                            onClick={() => this.checkall('checkall', total)}
                                                        ></input>
                                                    </th>
                                                    <th colSpan="1" rowSpan="1">
                                                        S.No
                                                        <i
                                                            style={{ paddingLeft: '10px' }}
                                                            className={sorticondef}
                                                            id="created"
                                                            onClick={e => this.sort(e, "created")}
                                                        />
                                                    </th>
                                                    <th>
                                                        Name
                                                        <i
                                                            style={{ paddingLeft: '10px' }}
                                                            className={sorticondef}
                                                            id="name"
                                                            onClick={e => this.sort(e, "name")}
                                                        />
                                                    </th>
                                                    <th>
                                                        Email
                                                        <i
                                                            style={{ paddingLeft: '10px' }}
                                                            className={sorticondef}
                                                            id="email"
                                                            onClick={e => this.sort(e, "email")}
                                                        />
                                                    </th>
                                                    <th>
                                                        Phone Number
                                                        <i
                                                            style={{ paddingLeft: '10px' }}
                                                            className={sorticondef}
                                                            id="mobile"
                                                            onClick={e => this.sort(e, "mobile")}
                                                        />
                                                    </th>
                                                    {checkprivilegsEdit && <>
                                                        <th>
                                                            Open Hours
                                                        <i
                                                                style={{ paddingLeft: '10px' }}
                                                                className={sorticondef}
                                                                id="openhours"
                                                                onClick={e => this.sort(e, "openhours")}
                                                            />
                                                        </th>
                                                        <th>
                                                            Email Verified
                                                        <i
                                                                style={{ paddingLeft: '10px' }}
                                                                className={sorticondef}
                                                                id="emailVerified"
                                                                onClick={e => this.sort(e, "emailVerified")}
                                                            />
                                                        </th>
                                                        <th>
                                                            Phone Verified
                                                        <i
                                                                style={{ paddingLeft: '10px' }}
                                                                className={sorticondef}
                                                                id="phoneVerified"
                                                                onClick={e => this.sort(e, "phoneVerified")}
                                                            />
                                                        </th>
                                                        <th>
                                                            Insurance
                                                        <i
                                                                style={{ paddingLeft: '10px' }}
                                                                className={sorticondef}
                                                                id="insurance"
                                                                onClick={e => this.sort(e, "insurance")}
                                                            />
                                                        </th>
                                                        <th>
                                                            Maintenance
                                                        <i
                                                                style={{ paddingLeft: '10px' }}
                                                                className={sorticondef}
                                                                id="maintenance"
                                                                onClick={e => this.sort(e, "maintenance")}
                                                            />
                                                        </th>
                                                    </>
                                                    }
                                                    <th>
                                                        Number of Cars
                                                        <i
                                                            style={{ paddingLeft: '10px' }}
                                                            className={sorticondef}
                                                            id="cars"
                                                            onClick={e => this.sort(e, "cars")}
                                                        />
                                                    </th>
                                                    <th>
                                                        Owner Agreement
                                                    </th>
                                                    <th>
                                                        Created Date
                                                        {/* <i
                                                            style={{ paddingLeft: '10px' }}
                                                            className={sorticondef}
                                                            id="created"
                                                            onClick={e => this.sort(e, "created")}
                                                        /> */}
                                                    </th>
                                                    {checkprivilegsEdit && <>
                                                        <th>
                                                            Status
                                                        <i
                                                                style={{ paddingLeft: '10px' }}
                                                                className={sorticondef}
                                                                id="status"
                                                                onClick={e => this.sort(e, "status")}
                                                            />
                                                        </th>
                                                    </>}
                                                    <th>
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableData && tableData.length > 0 ? <>
                                                    {tableData && tableData.length > 0 && tableData.map((value, index) => {
                                                        return <tr key={index}>
                                                            <td>
                                                                <input value={value._id} id={index} onClick={e => { this.checkbox(index, value._id) }} type='checkbox' />
                                                            </td>
                                                            <td >{skip + index + 1}</td>
                                                            <td className='text-capitalize'>{value.name}</td>
                                                            <td>{value.email}</td>
                                                            <td>{value.mobile || '-'}</td>
                                                            {checkprivilegsEdit && <>
                                                                <td>
                                                                    <Link to={`/admin/owner/open_hours/${value._id}`} id={`click${index + 1}`}>
                                                                        <span className='far fa-clock' />
                                                                    </Link>
                                                                </td>
                                                                <td>
                                                                    {value.emailVerified ?
                                                                        <>
                                                                            <Button color='success' onClick={e => this.checkPop('status', value._id, 'emailVerified')} id={`email${index + 1}`}>Yes</Button>
                                                                            <UncontrolledTooltip placement="top" target={`email${index + 1}`}>
                                                                                Click to Unverified
                                                                        </UncontrolledTooltip>
                                                                        </> :
                                                                        <>
                                                                            <Button color='danger' onClick={e => this.checkPop('status', value._id, 'emailVerified')} id={`email${index + 1}`}>No</Button>
                                                                            <UncontrolledTooltip placement="top" target={`email${index + 1}`}>
                                                                                Click to Verified
                                                                        </UncontrolledTooltip>
                                                                        </>
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {value.phoneVerified ?
                                                                        <>
                                                                            <Button color='success' onClick={e => this.checkPop('status', value._id, 'phoneVerified')} id={`phone${index + 1}`}>Yes</Button>
                                                                            <UncontrolledTooltip placement="top" target={`phone${index + 1}`}>
                                                                                Click to Unverified
                                                                        </UncontrolledTooltip>
                                                                        </> :
                                                                        <>
                                                                            <Button color='danger' onClick={e => this.checkPop('status', value._id, 'phoneVerified')} id={`phone${index + 1}`}>No</Button>
                                                                            <UncontrolledTooltip placement="top" target={`phone${index + 1}`}>
                                                                                Click to Verified
                                                                        </UncontrolledTooltip>
                                                                        </>
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {value.insurance ?
                                                                        <>
                                                                            <Button color='success' onClick={e => this.checkPop('status', value._id, 'insurance')} id={`insurance${index + 1}`}>Yes</Button>
                                                                            <UncontrolledTooltip placement="top" target={`insurance${index + 1}`}>
                                                                                Click to Unverified
                                                                        </UncontrolledTooltip>
                                                                        </> :
                                                                        <>
                                                                            <Button color='danger' onClick={e => this.checkPop('status', value._id, 'insurance')} id={`insurance${index + 1}`}>No</Button>
                                                                            <UncontrolledTooltip placement="top" target={`insurance${index + 1}`}>
                                                                                Click to Verified
                                                                        </UncontrolledTooltip>
                                                                        </>
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {value.maintenance ?
                                                                        <>
                                                                            <Button color='success' onClick={e => this.checkPop('status', value._id, 'maintenance')} id={`maintenance${index + 1}`}>Yes</Button>
                                                                            <UncontrolledTooltip placement="top" target={`maintenance${index + 1}`}>
                                                                                Click to Unverified
                                                                        </UncontrolledTooltip>
                                                                        </>
                                                                        :
                                                                        <><Button color='danger' onClick={e => this.checkPop('status', value._id, 'maintenance')} id={`maintenance${index + 1}`}>No</Button>
                                                                            <UncontrolledTooltip placement="top" target={`maintenance${index + 1}`}>
                                                                                Click to Verified
                                                                        </UncontrolledTooltip>
                                                                        </>
                                                                    }
                                                                </td>
                                                            </>}
                                                            <td>{value.cars && value.cars.length}</td>
                                                            <td>
                                                                <span className='far fa-file-pdf' onClick={e => this.onAction('export', 'api/generate/agreement/pdf', 'ownerAgreement', value.name)} style={{ cursor: 'pointer' }} id={`dow${index + 1}`} />
                                                                <UncontrolledTooltip placement="top" target={`dow${index + 1}`}>
                                                                    Click to Download
                                                                </UncontrolledTooltip>
                                                            </td>
                                                            <td>{moment(value.created).format('MM/DD/YYYY')}</td>
                                                            {checkprivilegsEdit && <>
                                                                <td> {value.status === "ACTIVE" ?
                                                                    <>
                                                                        <Button color='success' id={`tooltiptop${index + 1}`} onClick={e => this.checkPop('status', value._id, 'status')}>{value.status}
                                                                        </Button>
                                                                        <UncontrolledTooltip placement="top" target={`tooltiptop${index + 1}`}>
                                                                            Click to Inactive
                                                                                    </UncontrolledTooltip>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <Button onClick={e => this.checkPop('status', value._id, 'status')} id={`tooltiptop${index + 1}`}>{value.status}
                                                                        </Button>
                                                                        <UncontrolledTooltip placement="top" target={`tooltiptop${index + 1}`}>
                                                                            Click to Active
                                                                                    </UncontrolledTooltip>
                                                                    </>
                                                                }
                                                                </td>
                                                            </>}
                                                            <td>
                                                                <i className='fas fa-eye' id={`view${index + 1}`} style={{ cursor: 'pointer' }} onClick={e => this.onAction('view', value._id)} />
                                                                <UncontrolledTooltip placement="top" target={`view${index + 1}`}>
                                                                    View
                                                                </UncontrolledTooltip>
                                                                {AccessCheckViewMenu(Access, Admintype, 'delete') && <> <i className='fas fa-trash-alt' id={`delete${index + 1}`} style={{ cursor: 'pointer' }} onClick={e => this.checkPop('delete', value._id)} />
                                                                    <UncontrolledTooltip placement="top" target={`delete${index + 1}`}>
                                                                        Delete
                                                                    </UncontrolledTooltip>
                                                                </>}
                                                                {checkprivilegsEdit && <>
                                                                    <><i className='fas fa-pencil-alt' style={{ cursor: 'pointer' }} onClick={e => this.onAction('edit', value._id)} id={`edit${index + 1}`} />
                                                                        <UncontrolledTooltip placement="top" target={`edit${index + 1}`}>
                                                                            Edit
                                                                        </UncontrolledTooltip>
                                                                        <i className='fas fa-lock' style={{ cursor: 'pointer' }} onClick={e => this.onAction('password', value._id)} id={`pass${index + 2}`} />
                                                                        <UncontrolledTooltip placement="top" target={`pass${index + 2}`} className='tolltiptop'>
                                                                            Change Password
                                                                        </UncontrolledTooltip>
                                                                    </>
                                                                </>
                                                                }
                                                            </td>
                                                        </tr>
                                                    })}
                                                </> : loading ? <tr ><td colSpan="13" className='text-center'><div role="status" className="spinner-border text-secondary"><span className="sr-only">Loading...</span></div></td></tr> : <tr ><td colSpan="13" className='text-center'>No Records Found</td></tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='row'>
                                        <div className="col-sm-12 col-md-6">
                                            <div className="dataTables_info" id="example_info" role="status" >
                                                Showing  &nbsp;
                                                {tableData.length === 0 ? 0
                                                    : pagecount.startIndex * Number(tableOptions.limit) + 1}
                                                &nbsp;to  {pagecount.endIndex + 1} of&nbsp;
                                                {total} entries
                                            </div>
                                        </div>
                                        <div className='col-sm-12 col-md-6 text-right'>
                                            <div className='dataTables_paginate paging_simple_numbers' id='example_paginate'>
                                                <ul className='pagination'>
                                                    <li
                                                        className={page === 1 ? 'paginate_button page-item previous disabled' : 'paginate_button page-item previous'} id='example_previous' onClick={e => this.Pagination('Prev')} >
                                                        <button aria-controls="example" data-dt-idx="0" tabIndex="0" className="page-link">
                                                            Previous
                                                            </button>
                                                    </li>
                                                    {pagecount.pages.length > 0 ?
                                                        <>
                                                            {pagecount.pages.map((value, i) => {
                                                                return <li key={i} className={page === value ? "paginate_button page-item active" : 'paginate_button page-item'
                                                                }>
                                                                    <button aria-controls="example" tabIndex="0" className="page-link" onClick={e => this.Pagination(value)}>{value}</button>
                                                                </li>
                                                            })}
                                                        </> : <li className={"paginate_button page-item active"}>
                                                            <button aria-controls="example" tabIndex="0" className="page-link">1</button>
                                                        </li>
                                                    }
                                                    <li onClick={e => this.Pagination('Next')} className={page === pagecount.endPage ? 'paginate_button page-item next disabled' : "paginate_button page-item next"} id="example_next">
                                                        <button aria-controls="example" data-dt-idx="7" tabIndex="0" className="page-link">Next</button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Change Password Form for Individual admin */}
                                    <Modal isOpen={modalOpen} toggle={() => {
                                        this.setState({ modalOpen: !this.state.modalOpen, password: '', c_password: '', admin_id: '' })
                                    }}>
                                        <ModalHeader toggle={() => {
                                            this.setState({ modalOpen: !this.state.modalOpen, password: '', c_password: '', admin_id: '' })
                                        }}>
                                            Change Password
                                        </ModalHeader>
                                        <ModalBody>
                                            <AvForm onValidSubmit={() => this.onValidSubmit()}>
                                                <AvField label='New Password' type='password' value={this.state.password || ''} name='password' id='password' onChange={(e) => {
                                                    this.setState({ [e.target.name]: e.target.value })
                                                }} required errorMessage="Enter Valid Password" validate={{
                                                    pattern: { value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, errorMessage: 'Password must be one uppercase letter, one lower case letter,one number and one special character' }, maxLength: { value: 8, errorMessage: 'Your password should be  8 characters' },
                                                    minLength: { value: 8, errorMessage: 'Your password should be  8 characters' }
                                                }} />
                                                <AvField label='Re-type Password' type='password' value={this.state.c_password || ''} name='c_password' id='c_password' onChange={(e) => {
                                                    this.setState({ [e.target.name]: e.target.value })
                                                }} required errorMessage="Re-type the Above Password" validate={{
                                                    pattern: { value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, errorMessage: 'Password must be one uppercase letter, one lower case letter,one number and one special character' }, maxLength: { value: 8, errorMessage: 'Your password should be  8 characters' },
                                                    minLength: { value: 8, errorMessage: 'Your password should be  8 characters' }
                                                }} />
                                                <div className='formbutons'>
                                                    <Button color='primary'>Submit</Button><Button onClick={() => {
                                                        this.setState({ modalOpen: !this.state.modalOpen, password: '', c_password: '', admin_id: '' })
                                                    }}>Cancel</Button>
                                                </div>
                                            </AvForm>
                                        </ModalBody>
                                    </Modal>
                                    {/*---------- End--------------  */}
                                    {this.state.confirm_both ?
                                        <SweetAlert
                                            title="Are you sure?"
                                            warning
                                            showCancel
                                            confirmBtnBsStyle="success"
                                            cancelBtnBsStyle="danger"
                                            onConfirm={() => this.onAction(get(confirm_both, 'type', false), get(confirm_both, 'id', false), get(confirm_both, 'value', false), get(confirm_both, 'name', false))}
                                            onCancel={() => this.setState({ confirm_both: false }, () => this.clearCheckBox())} >
                                        </SweetAlert> : null}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}
export default OwnerList;
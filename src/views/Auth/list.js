import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader, Button, ModalHeader, Modal, ModalBody, UncontrolledTooltip } from 'reactstrap';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { activateAuthLayout } from '../../redux/actions';
import request from '../../helpers/api'
import SweetAlert from 'react-bootstrap-sweetalert';
import { NotificationManager } from '../../components/ReactNotifications'
import moment from 'moment';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import {GetPagniationArray } from '../../helpers/authUtils';
class List extends Component {
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
            field: 'admintype',
        }
    }
    componentDidMount() {
        this.props.activateAuthLayout();
        let { tableOptions } = this.state
        request({
            url: '/api/admin/list',
            method: 'POST',
            data: tableOptions
        }).then(res => {
            if (res && res.status === 200 && res.data) {
                this.setState({
                    tableData: res.data.result,
                    total: res.data.count,
                    currPage: res.data.result.length,
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
            console.log(err)
            this.setState({
                tableData: [],
                total: 0,
                currPage: 0,
                loading: false
            })
        })
    }
    search = (e) => {
        let value = e.target.value
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
        // if (count > 1) {
        //     if (this.len !== count)
        //         this.setState({ page: count })
        // }

    }
    sort = (e, field) => {
        var sorticondef = 'fas fa-sort';
        var id = ['name', 'email', 'username', 'admintype', 'loginDateTime', 'logoutDateTime', 'status'];
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
        let len = this.state.currPage - 1;
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
    onAction = (type, id, value) => {
        switch (type) {
            case 'view':
                this.props.history.push({
                    pathname: `/admin/view`,
                    state: { rowid: id }
                });
                break;
            case 'edit':
                this.props.history.push({
                    pathname: `/admin/add`,
                    state: { rowid: id }
                });
                break;
            case 'password':
                this.setState({ modalOpen: true, admin_id: id })
                break;
            case 'status':
                request({
                    url: `/api/admin/change/status/${id}`,
                    method: 'PUT',
                    data: {
                        status: value
                    }
                }).then(res => {
                    if (res && res.status === 200) {
                        NotificationManager.success('Status Updated Successfully', 'SUCCESS', 3000, null, null, 'filled', 'check-circle')
                        this.componentDidMount()
                    }
                }).catch(err => {
                    console.log('status update error' + err)
                })
                break;
            case 'delete':
                if (value) {
                    request({
                        url: `/api/subadmin/${id}`,
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
                } else {
                    this.setState({ confirm_both: id })
                }
                break;
            default:
        }
    }
    BulkAction = (type) => {
        let { bulk } = this.state
        if (bulk.length > 0) {
            this.setState({ loading: true, TableData: [] })
            if (type !== 'delete') {
                request({
                    url: '/api/subadmin',
                    method: 'PUT',
                    data: {
                        status: type,
                        subadmin: bulk
                    }
                }).then(res => {
                    if (res && res.status === 200) {
                        document.getElementById('checkall').checked = false;
                        for (let i = 0; i < this.state.currPage; i++) {
                            if (document.getElementById(i)) {
                                document.getElementById(i).checked = false;
                            }
                        }
                        this.setState(function (state) {
                            state.count = 0;
                            state.bulk = [];
                        });
                        NotificationManager.success('Status Updated Successfully', 'SUCCESS', 3000, null, null, 'filled', 'check-circle')
                        this.componentDidMount()
                    }
                }).catch(err => {
                    document.getElementById('checkall').checked = false;
                    for (let i = 0; i < this.state.currPage; i++) {
                        if (document.getElementById(i)) {
                            document.getElementById(i).checked = false;
                        }
                    }
                    this.setState(function (state) {
                        state.count = 0;
                        state.bulk = [];
                    });
                    console.log('bulk status update error' + err)
                })
            } else {
                console.log('eeeeeeeeeee', bulk.length)
                let url = 'api/subadmin?'
                bulk.map((value) => {
                    url = `${url}id=${value}&`
                    return true
                })
                request({
                    url: url,
                    method: 'DELETE',
                }).then(res => {
                    if (res && res.status === 200) {
                        this.componentDidMount()
                        NotificationManager.success('Deleted Successfully', 'SUCCESS', 3000, null, null, 'filled', 'check-circle')
                        document.getElementById('checkall').checked = false;
                        for (let i = 0; i < this.state.currPage; i++) {
                            if (document.getElementById(i)) {
                                document.getElementById(i).checked = false;
                            }
                        }
                        this.setState(function (state) {
                            state.count = 0;
                            state.bulk = [];
                        });
                    }
                }).catch(err => {
                    console.log(err)
                })

            }
        } else {
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
            NotificationManager.error('Nothing Selected To Perform', 'ERROR', 3000, null, null, 'filled', 'times-circle')
            return false
        }
    }
    onValidSubmit = () => {
        let { password, c_password, admin_id } = this.state
        if (password === c_password) {
            request({
                url: `api/subadmin/change/password/${admin_id}`,
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
    render() {
        const { tableData, total, sortOrder, loading, tableOptions, modalOpen } = this.state
        var sorticondef = 'fas fa-sort';
        var sorticon = `fas fa-sort${sortOrder === null ? '' : sortOrder === true ? '-amount-up' : '-amount-down'}`;
        if (tableOptions.field) {
            if (document.getElementById(tableOptions.field)) {
                document.getElementById(tableOptions.field).className = sorticon;
            }
        }
        let page = tableOptions.page.current
        const pagecount = GetPagniationArray(total, tableOptions.page.current, tableOptions.limit)
        return (
            <React.Fragment>
                <Container fluid>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader >
                                    <Row>
                                        <Col lg='7'>
                                            Admin User List
                                        </Col>
                                        <Col lg='5' >
                                            <div className='bulkaction'>
                                                <Button onClick={e => this.BulkAction('ACTIVE')}>
                                                    <i className='fas fa-check-circle text-success' />
                                                    Active
                                                    </Button>
                                                <Button onClick={e => this.BulkAction('INACTIVE')}>
                                                    <i className='fas fa-ban text-danger' />
                                                    In-Active
                                                    </Button>
                                                <Button onClick={e => this.BulkAction('delete')}>
                                                    <i className='fas fa-times-circle text-danger' />
                                                    Delete
                                                </Button>
                                                <Link to='/admin/add'>
                                                    <Button color='success'>
                                                        <i className='fas fa-plus-circle text-danger' />
                                                        Add
                                                </Button>
                                                </Link>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <div className='row d-flex'>
                                        <div className=' col-md-10 '>
                                            <label>
                                                Search
                                            <input type='text' value={tableOptions.search || ''} onChange={e => this.search(e)} className='form-control form-control-sm' placeholder='Search' />
                                            </label>
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
                                            <thead style={{ boxSizing: 'unset' }} className='theadclass'>
                                                <tr>
                                                    <th colSpan="1" rowSpan="1">
                                                        <input
                                                            type='checkbox'
                                                            id='checkall'
                                                            onClick={() => this.checkall('checkall', total)}
                                                        ></input>
                                                    </th>
                                                    <th colSpan="1" rowSpan="1">
                                                        Name
                                                        <i
                                                            style={{ paddingLeft: '10px' }}
                                                            className={sorticondef}
                                                            id="name"
                                                            onClick={e => this.sort(e, "name")}
                                                        />
                                                    </th>
                                                    <th colSpan="1" rowSpan="1">
                                                        Email
                                                        <i
                                                            style={{ paddingLeft: '10px' }}
                                                            className={sorticondef}
                                                            id="email"
                                                            onClick={e => this.sort(e, "email")}
                                                        />
                                                    </th>
                                                    <th colSpan="1" rowSpan="1">
                                                        Login Username
                                                        <i
                                                            style={{ paddingLeft: '10px' }}
                                                            className={sorticondef}
                                                            id="username"
                                                            onClick={e => this.sort(e, "username")}
                                                        />
                                                    </th>
                                                    <th colSpan="1" rowSpan="1">
                                                        Admin Type
                                                        <i
                                                            style={{ paddingLeft: '10px' }}
                                                            className={sorticondef}
                                                            id="admintype"
                                                            onClick={e => this.sort(e, "admintype")}
                                                        />
                                                    </th>
                                                    <th colSpan="1" rowSpan="1">
                                                        Last Login Date
                                                    <i
                                                            style={{ paddingLeft: '10px' }}
                                                            className={sorticondef}
                                                            id="loginDateTime"
                                                            onClick={e => this.sort(e, "loginDateTime")}
                                                        />
                                                    </th>
                                                    <th colSpan="1" rowSpan="1">
                                                        Last Login IP
                                                        {/* <i
                                                            style={{ paddingLeft: '10px' }}
                                                            className={sorticondef}
                                                            id="date"
                                                            onClick={e => this.sort(e, "date")}
                                                        /> */}
                                                    </th>
                                                    <th colSpan="1" rowSpan="1">
                                                        Last Logout Date
                                                    <i
                                                            style={{ paddingLeft: '10px' }}
                                                            className={sorticondef}
                                                            id="logoutDateTime"
                                                            onClick={e => this.sort(e, "logoutDateTime")}
                                                        />
                                                    </th>

                                                    <th colSpan="1" rowSpan="1">
                                                        Status
                                                    <i
                                                            style={{ paddingLeft: '10px' }}
                                                            className={sorticondef}
                                                            id="status"
                                                            onClick={e => this.sort(e, "status")}
                                                        />
                                                    </th>

                                                    <th colSpan="1" rowSpan="1">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableData && tableData.length > 0 ? <>
                                                    {tableData && tableData.map((value, index) => {
                                                        let type = value.admintype === "superadmin" ? true : false;
                                                        return (
                                                            <tr key={index}>
                                                                <td>
                                                                    <input value={value._id} id={type ? '' : index} onClick={e => { this.checkbox(index, value._id) }} type='checkbox' disabled={type} />
                                                                </td>
                                                                <td>
                                                                    {value.name || '-'}
                                                                </td>
                                                                <td>
                                                                    {value.email}
                                                                </td>
                                                                <td>
                                                                    {value.username || '-'}
                                                                </td>
                                                                <td>
                                                                    {value.admintype || value.type || '-'}
                                                                </td>
                                                                <td>
                                                                    {moment(value.loginDateTime).format("YYYY-MM-DD HH:mm") || '-'}
                                                                </td>
                                                                <td>
                                                                    {value.loginIP || '-'}
                                                                </td>
                                                                <td>
                                                                    {moment(value.logoutDateTime).format("YYYY-MM-DD HH:mm") || '-'}
                                                                </td>

                                                                <td>
                                                                    {
                                                                        value.admintype === "superadmin" ? <span className='text-success'>{'Active'}</span>
                                                                            : value.status === "ACTIVE" ?
                                                                                <>
                                                                                    <Button color='success' id={`tooltiptop${index + 1}`} onClick={e => this.onAction('status', value._id, 'INACTIVE')}>{value.status}
                                                                                    </Button>
                                                                                    <UncontrolledTooltip placement="top" target={`tooltiptop${index + 1}`}>
                                                                                        Click to Inactive
                                                                                    </UncontrolledTooltip>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    <Button onClick={e => this.onAction('status', value._id, 'ACTIVE')} id={`tooltiptop${index + 1}`}>{value.status}
                                                                                    </Button>
                                                                                    <UncontrolledTooltip placement="top" target={`tooltiptop${index + 1}`}>
                                                                                        Click to Active
                                                                                    </UncontrolledTooltip>
                                                                                </>
                                                                    }

                                                                </td>
                                                                <td>
                                                                    {!type
                                                                        && <>
                                                                            {/*View Icon */}
                                                                            <i className='fas fa-eye' id={`view${index + 1}`} style={{ cursor: 'pointer' }} onClick={e => this.onAction('view', value._id)} />
                                                                            <UncontrolledTooltip placement="top" target={`view${index + 1}`}>
                                                                                View
                                                                            </UncontrolledTooltip>
                                                                            {/*View Icon End*/}
                                                                            {/*Delete Icon */}
                                                                            <i className='fas fa-trash-alt' id={`delete${index + 1}`} style={{ cursor: 'pointer' }} onClick={e => this.onAction('delete', value._id)} />
                                                                            <UncontrolledTooltip placement="top" target={`delete${index + 1}`}>
                                                                                Delete
                                                                            </UncontrolledTooltip></>}
                                                                    {/*Delete Icon  End*/}
                                                                    {/*Edit Icon*/}
                                                                    <i className='fas fa-pencil-alt' style={{ cursor: 'pointer' }} onClick={e => this.onAction('edit', value._id)} id={`edit${index + 1}`} />
                                                                    <UncontrolledTooltip placement="top" target={`edit${index + 1}`}>
                                                                        Edit
                                                                            </UncontrolledTooltip>
                                                                    {/*Edit Icon End*/}
                                                                    {/*Password Icon*/}
                                                                    <i className='fas fa-lock' style={{ cursor: 'pointer' }} onClick={e => this.onAction('password', value._id)} id={`pass${index + 2}`} />
                                                                    <UncontrolledTooltip placement="top" target={`pass${index + 2}`} className='tolltiptop'>
                                                                        Change Password
                                                                            </UncontrolledTooltip>
                                                                    {/*Password Icon End*/}


                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </> : loading ? <tr ><td colSpan="10" className='text-center'><div role="status" className="spinner-border text-secondary"><span className="sr-only">Loading...</span></div></td></tr> : <tr ><td colSpan="10" className='text-center'>No Records Found</td></tr>
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
                                            onConfirm={() => this.setState({ confirm_both: false, success_dlg: this.state.confirm_both, dynamic_title: 'Deleted', dynamic_description: 'Your file has been deleted.' })}
                                            onCancel={() => this.setState({ confirm_both: false, error_dlg: true, dynamic_title: 'Cancelled', dynamic_description: 'Your imaginary file is safe :)' })} >
                                            You won't be able to revert this!
                                            </SweetAlert> : null}
                                    {this.state.success_dlg ?
                                        <SweetAlert
                                            success
                                            title={this.state.dynamic_title}
                                            onConfirm={() => {
                                                this.onAction('delete', this.state.success_dlg, true)
                                            }}  >
                                            {this.state.dynamic_description}
                                        </SweetAlert> : null}

                                    {this.state.error_dlg ?
                                        <SweetAlert
                                            error
                                            title={this.state.dynamic_title}
                                            onConfirm={() => this.setState({ error_dlg: false, deletekey: false })}  >
                                            {this.state.dynamic_description}
                                        </SweetAlert> : null}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment >
        );
    }
}

export default withRouter(connect(null, { activateAuthLayout })(List));
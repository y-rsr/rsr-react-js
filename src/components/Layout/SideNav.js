import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash'
import { AccessCheckViewMenu } from '../../helpers/authUtils';
class SideNav extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        let { adminAccess } = this.props, superAdmin = _.get(this.props.user, 'admintype', false)
        let owner = AccessCheckViewMenu(_.get(adminAccess, '0', {}), superAdmin, 'view')
        // paymentowner = AccessCheckViewMenu(_.get(adminAccess, '1', {}), superAdmin, 'view'),
        // Driver = AccessCheckViewMenu(_.get(adminAccess, '2', {}), superAdmin, 'view'),
        // Driver_accounts = AccessCheckViewMenu(_.get(adminAccess, '3', {}), superAdmin, 'view'),
        // Agents = AccessCheckViewMenu(_.get(adminAccess, '4', {}), superAdmin, 'view'),
        // Cars = AccessCheckViewMenu(_.get(adminAccess, '5', {}), superAdmin, 'view'),
        // Maintenance = AccessCheckViewMenu(_.get(adminAccess, '6', {}), superAdmin, 'view'),
        // Claims = AccessCheckViewMenu(_.get(adminAccess, '7', {}), superAdmin, 'view'),
        // Care_Attributes = AccessCheckViewMenu(_.get(adminAccess, '8', {}), superAdmin, 'view'),
        // Bookings = AccessCheckViewMenu(_.get(adminAccess, '9', {}), superAdmin, 'view'),
        // Messages = AccessCheckViewMenu(_.get(adminAccess, '10', {}), superAdmin, 'view'),
        // Fee_Management = AccessCheckViewMenu(_.get(adminAccess, '11', {}), superAdmin, 'view'),
        // Manage_City = AccessCheckViewMenu(_.get(adminAccess, '12', {}), superAdmin, 'view'),
        // Lien_Holders = AccessCheckViewMenu(_.get(adminAccess, '13', {}), superAdmin, 'view'),
        // Newsletters = AccessCheckViewMenu(_.get(adminAccess, '14', {}), superAdmin, 'view'),
        // Pages = AccessCheckViewMenu(_.get(adminAccess, '15', {}), superAdmin, 'view'),
        // Review = AccessCheckViewMenu(_.get(adminAccess, '16', {}), superAdmin, 'view'),
        // Payment_Gateway = AccessCheckViewMenu(_.get(adminAccess, '17', {}), superAdmin, 'view'),
        // Contact = AccessCheckViewMenu(_.get(adminAccess, '18', {}), superAdmin, 'view'),
        // Subscribers = AccessCheckViewMenu(_.get(adminAccess, '19', {}), superAdmin, 'view'),
        // Ambassador = AccessCheckViewMenu(_.get(adminAccess, '20', {}), superAdmin, 'view'),
        // Tolls = AccessCheckViewMenu(_.get(adminAccess, '21', {}), superAdmin, 'view'),
        // Parking_Tickets = AccessCheckViewMenu(_.get(adminAccess, '21', {}), superAdmin, 'view')


        let OwneAdd = AccessCheckViewMenu(_.get(adminAccess, '0', {}), superAdmin, 'add')
        return (
            <React.Fragment>
                <div id="sidebar-menu">
                    <ul className="metismenu" id="menu">
                        <li className="menu-title">Main</li>
                        <li>
                            <Link to="/admin/dashboard" className="waves-effect">
                                <i className="ti-home"></i> <span> Dashboard </span>
                            </Link>
                        </li>
                        {owner && <li>
                            <Link to="/admin/owners" className="waves-effect" >
                                <i className="fa fa-user-circle"></i> <span> Owners <span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="/admin/owner/list">Owners List</Link></li>
                                {/* <li><Link to="/admin/owner/deactive">Deactivated Owners</Link></li>
                                <li><Link to="/admin/owner/sub">Sub Owners</Link></li> */}
                                {OwneAdd && <li><Link to="/admin/owner/add">Add New Owner</Link></li>}
                            </ul>
                        </li>}
                        {/* {paymentowner && <li>
                            <Link to="/#" className="waves-effect">
                                <i className="fab fa-stack-overflow"></i> <span>Payment To Owners <span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="#">Payable & Receivable</Link></li>
                                <li><Link to="#">Pending Payment</Link></li>
                                <li><Link to="#">Paid Payments</Link></li>
                                <li><Link to="#">Pending Taxes Owed</Link></li>
                                <li><Link to="#">Paid Taxes Owed</Link></li>
                                <li><Link to="#">Export Pending Payments</Link></li>
                                <li><Link to="#">Export Paid Payments</Link></li>
                            </ul>
                        </li>}
                        {Driver && <li>
                            <Link to="/#" className="waves-effect">
                                <i className="fas fa-users"></i> <span>Drivers <span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="#">Drivers</Link></li>
                                <li><Link to="#">Active Drivers</Link></li>
                                <li><Link to="#">Add New Drivers</Link></li>
                                <li><Link to="#">Driver's History</Link></li>
                                <li><Link to="#">Late Payments</Link></li>
                            </ul>
                        </li>}
                        {Driver_accounts && <li>
                            <Link to="/#" className="waves-effect">
                                <i className="far fa-money-bill-alt"></i> <span>Drivers Accounts<span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="#">Paid Payments</Link></li>
                                <li><Link to="#">Active Driver's Deposit</Link></li>
                                <li><Link to="#">Completed Drivers Deposit</Link></li>
                                <li><Link to="#">Paid Deposit</Link></li>
                                <li><Link to="#">Active Late Insurance</Link></li>
                                <li><Link to="#">Dropped Late Insurance</Link></li>
                                <li><Link to="#">Due From Drivers</Link></li>
                                <li><Link to="#">Closed Due From Drivers</Link></li>
                            </ul>
                        </li>}
                        {Agents && <li>
                            <Link to="/#" className="waves-effect">
                                <i className="fas fa-user-secret"></i> <span>Agents<span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="#">Agents Dashboard</Link></li>
                                <li><Link to="#">Agents List</Link></li>
                                <li><Link to="#">Add Agents</Link></li>
                                <li><Link to="#">Paid Deposit</Link></li>
                                <li><Link to="#"> Boarding List</Link></li>
                                <li><Link to="#">Waiting List</Link></li>
                            </ul>
                        </li>}
                        {Cars && <li>
                            <Link to="/#" className="waves-effect">
                                <i className="fas fa-car-alt"></i> <span>Cars<span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="#">Cars</Link></li>
                                <li><Link to="#">Active Cars</Link></li>
                                <li><Link to="#">Inactive Cars</Link></li>
                                <li><Link to="#">Add New Car</Link></li>
                            </ul>
                        </li>}
                        {Maintenance && <li>
                            <Link to="/#" className="waves-effect">
                                <i className="fas fa-exclamation-triangle"></i>
                                <span>Maintenance<span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="#">Maintenance Dashboard</Link></li>
                                <li><Link to="#">Maintenance Attributes</Link></li>
                                <li><Link to="#">Maintenance History</Link></li>
                            </ul>
                        </li>}
                        {Claims && <li>
                            <Link to="/#" className="waves-effect">
                                <i className="far fa-file-alt"></i>
                                <span>Claims<span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="#">Opent Claims</Link></li>
                                <li><Link to="#">Closed Claims</Link></li>
                                <li><Link to="#">Drivers Claims</Link></li>
                                <li><Link to="#">Claimant Claims</Link></li>
                            </ul>
                        </li>}
                        {Care_Attributes && <li>
                            <Link to="/#" className="waves-effect">
                                <i className="fas fa-cogs"></i>
                                <span>Care Attributes<span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="#">Care Makes</Link></li>
                                <li><Link to="#">Care Models</Link></li>
                                <li><Link to="#">Care Features</Link></li>
                            </ul>
                        </li>}
                        {Bookings && <li>
                            <Link to="/#" className="waves-effect">
                                <i className="far fa-calendar-alt"></i>
                                <span>Bookings<span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="#">Applied Bookings</Link></li>
                                <li><Link to="#">Waiting For Owner Approval</Link></li>
                                <li><Link to="#">Waiting For Pickup</Link></li>
                                <li><Link to="#">Waiting For Insurance</Link></li>
                                <li><Link to="#">Initial Bookings</Link></li>
                                <li><Link to="#">Extended Bookings</Link></li>
                                <li><Link to="#">Completed Bookings</Link></li>
                                <li><Link to="#">Dropped Bookings</Link></li>
                                <li><Link to="#">Cancelled Bookings</Link></li>
                                <li><Link to="#">Expired Bookings</Link></li>
                                <li><Link to="#">Add New Booking</Link></li>
                                <li><Link to="#">Modify Pickup Date</Link></li>
                                <li><Link to="#">Add Extended Booking</Link></li>
                                <li><Link to="#">Change Deductible Insurance</Link></li>
                                <li><Link to="#">Dropped Rental Deductible</Link></li>
                            </ul>
                        </li>}
                        {Messages && <li>
                            <Link to="/#" className="waves-effect">
                                <i className="fas fa-comments"></i>
                                <span>Messages<span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="#">Conversations</Link></li>
                                <li><Link to="#">Direct Conversations</Link></li>
                                <li><Link to="#">Conversations With Drivers</Link></li>
                                <li><Link to="#">Conversations With Owners</Link></li>
                                <li><Link to="#">Message To Driver</Link></li>
                                <li><Link to="#">Message To Owner</Link></li>
                            </ul>
                        </li>}
                        {Fee_Management && <li>
                            <Link to="/#" className="waves-effect">
                                <i className="far fa-money-bill-alt"></i>
                                <span>Fee Management<span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="#">Fee List</Link></li>
                                <li><Link to="#">Owner Fees List</Link></li>
                                <li><Link to="#">Deductible Insurance</Link></li>
                                <li><Link to="#">City Taxes</Link></li>
                                <li><Link to="#">Tourism Surcharges</Link></li>
                                <li><Link to="#">Deposits</Link></li>
                                <li><Link to="#">Insurance</Link></li>
                            </ul>
                        </li>}
                        {Manage_City && <li>
                            <Link to="/#" className="waves-effect">
                                <i className="fas fa-building"></i>
                                <span>Manage City<span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="#">City List</Link></li>
                            </ul>
                        </li>}
                        {Lien_Holders && <li>
                            <Link to="/#" className="waves-effect">
                                <i className="fas fa-handshake"></i>
                                <span>Lien Holders<span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="#">Lien Holders List</Link></li>
                                <li><Link to="#">Add Lien Holders</Link></li>
                            </ul>
                        </li>}
                        {Newsletters && <li>
                            <Link to="/#" className="waves-effect">
                                <i className="fas fa-envelope"></i>
                                <span>Newsletters<span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="#">Email Template List</Link></li>
                                <li><Link to="#">Add Email Template</Link></li>
                                <li><Link to="#">SMS Template List</Link></li>
                                <li><Link to="#">Add SMS Template</Link></li>
                                <li><Link to="#">Mass E-Mail Campaigns</Link></li>
                                <li><Link to="#">Mass SMS Campaigns</Link></li>
                            </ul>
                        </li>}
                        {Pages && <li>
                            <Link to="/#" className="waves-effect">
                                <i className="fas fa-code"></i>
                                <span>Manage Static Pages<span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="#">List Of Pages</Link></li>
                                <li><Link to="#">Ambassador</Link></li>
                                <li><Link to="#">About Us</Link></li>
                                <li><Link to="#">How Its Work</Link></li>
                                <li><Link to="#">Contact Us</Link></li>
                            </ul>
                        </li>}
                        {Review && <li>
                            <Link to="/#" className="waves-effect">
                                <i className="fas fa-pen-square"></i>
                                <span>Review<span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="#">Review List</Link></li>
                                <li><Link to="#">Add Review</Link></li>
                            </ul>
                        </li>}
                        {Payment_Gateway && <li>
                            <Link to="#" className="waves-effect">
                                <i className="far fa-credit-card"></i><span className="badge badge-primary badge-pill float-right"></span> <span> Payment Gateway </span>
                            </Link>
                        </li>}
                        {Contact && <li>
                            <Link to="/#" className="waves-effect">
                                <i className="fas fa-comments"></i>
                                <span>Contact Us<span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="#">Unread Contact Us</Link></li>
                                <li><Link to="#">Read Contact Us</Link></li>
                            </ul>
                        </li>}
                        {Subscribers && <li>
                            <Link to="/#" className="waves-effect">
                                <i className="fas fa-bell"></i>
                                <span>Subscribers<span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="#">Yet To Downloaded</Link></li>
                                <li><Link to="#">Already Downloaded</Link></li>
                            </ul>
                        </li>}
                        {Ambassador && <li>
                            <Link to="#" className="waves-effect">
                                <i className="fas fa-gift"></i><span className="badge badge-primary badge-pill float-right"></span> <span>Ambassador</span>
                            </Link>
                        </li>}
                        {Tolls && <li>
                            <Link to="/#" className="waves-effect">
                                <i className="fas fa-university"></i>
                                <span>Tolls<span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="#">Unpaid Toll Transactions</Link></li>
                                <li><Link to="#">Paid Toll Transactions</Link></li>
                                <li><Link to="#">Unknown Transactions</Link></li>
                                <li><Link to="#">Auto Debits</Link></li>
                                <li><Link to="#">Import Transactions</Link></li>
                            </ul>
                        </li>}
                        {Parking_Tickets && <li>
                            <Link to="/#" className="waves-effect">
                                <i className="fas fa-ticket-alt"></i>
                                <span>Parking Tickets<span className="float-right menu-arrow"><i className="mdi mdi-chevron-right"></i></span> </span> </Link>
                            <ul className="submenu">
                                <li><Link to="#">Unpaid Parking Tickets</Link></li>
                                <li><Link to="#">Paid Parking Tickets</Link></li>
                            </ul>
                        </li>
                        } */}
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}


export default SideNav;
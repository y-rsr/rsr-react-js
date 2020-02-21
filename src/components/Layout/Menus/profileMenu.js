
import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { withRouter } from 'react-router-dom';

// users
import user4 from '../../../assets/images/users/user-4.jpg';

class ProfileMenu extends Component {

    constructor(props) {
        super(props);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.state = {
            menu: false,
        };
        this.toggle = this.toggle.bind(this);

    }

    toggle() {
        this.setState(prevState => ({
            menu: !prevState.menu
        }));
    }
    onMouseEnter() {
        this.setState({ dropdownOpen: true });
    }

    onMouseLeave() {
        this.setState({ dropdownOpen: false });
    }
    Logout = () => {
        this.props.Logout()
    }
    render() {
        let { Admintype } = this.props
        return (
            <React.Fragment>
                <Dropdown onMouseOver={this.onMouseEnter} onMouseLeave={this.onMouseLeave} isOpen={this.state.dropdownOpen} toggle={this.toggle} className="notification-list list-inline-item nav-pro-img d-inline-block" tag="li">
                    <DropdownToggle className="nav-link arrow-none nav-user waves-effect" tag="a">
                        <img src={user4} alt="user" className="rounded-circle" />
                    </DropdownToggle>
                    <DropdownMenu className="profile-dropdown" right>
                        {Admintype==='superadmin' && <><DropdownItem tag="button" onClick={e => this.props.history.push("/admin/list")}><i className="mdi mdi-account-circle m-r-5"></i> ADMIN USERS</DropdownItem></>}
                        <DropdownItem tag="button" onClick={e => this.props.history.push("/admin/change/password")}><i className="ion ion-md-key"></i> CHANGE PASSWORD</DropdownItem>
                        {Admintype==='superadmin' && <><DropdownItem tag="button" onClick={() => { this.props.history.push('/admin/setting') }}><i className="mdi mdi-settings m-r-5"></i> SETTINGS</DropdownItem>
                            <DropdownItem tag="button" onClick={e => this.props.history.push("/admin/smtp")}><i className="fa fa-envelope"></i> SMTP SETTINGS</DropdownItem></>}
                        <DropdownItem tag="a" href="#"><i className="fas fa-desktop"></i> VISIT SITE</DropdownItem>
                        <div className="dropdown-divider"></div>
                        <DropdownItem tag="a" className="text-danger" style={{ cursor: 'pointer' }} onClick={(e) => this.Logout()}><i className="mdi mdi-power text-danger"></i> Logout</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </React.Fragment >
        );
    }
}


export default withRouter(ProfileMenu);

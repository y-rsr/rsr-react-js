import React, { Component } from 'react';
// import LanguageMenu from './Menus/languageMenu';
import { Link } from 'react-router-dom';
import NotificationMenu from './Menus/notificationMenu';
import ProfileMenu from './Menus/profileMenu';

import { isLarge } from '../../redux/actions';
import { activateNonAuthLayout, ClearStore } from '../../redux/actions';
import { connect } from 'react-redux';

import request from '../../helpers/api'
import { NotificationManager } from '../ReactNotifications';

class Topbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            create_menu: false,
            toggle: false,
        };
        this.toggleCreate = this.toggleCreate.bind(this);
    }
    toggleCreate() {
        this.setState(prevState => ({
            create_menu: !prevState.create_menu
        }));
    }

    sidebarToggle = () => {
        document.body.classList.toggle('enlarged');
        this.props.isLarge(!this.props.is_large_state);
    }

    toggleFullscreen() {
        if (!document.fullscreenElement && /* alternative standard method */ !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }
    Logout = () => {
        let { _id } = this.props.user
        request({
            url: `api/admin/logout/${_id}`,
            method: 'POST'
        }).then(res => {
            if (res && res.status === 200) {
                NotificationManager.success('Logout Successfully', 'SUCCESS', 3000, null, null, 'filled')
                this.props.activateNonAuthLayout();
                this.props.ClearStore()
                // Remove all Item from localstorage and redirect to login page
                localStorage.removeItem('user');
                this.props.history.push('/');
                localStorage.clear()
            }


        }).catch(err => {
            console.log('logout Error', err)
        })

    }

    render() {
        let { Admintype } = this.props, { logo } = this.props.siteInfo
        console.log()
        return (
            <React.Fragment>
                <div className="topbar">
                    <div className="topbar-left">
                        <Link to="/" className="logo">
                            <span>
                                <img src={logo} alt="" height="18" />
                            </span>
                            <i>
                                <img src={logo} alt="" height="22" />
                            </i>
                        </Link>
                    </div>

                    <nav className="navbar-custom">
                        <ul className="navbar-right list-inline float-right mb-0">
                            {/* <li className="dropdown notification-list list-inline-item d-none d-md-inline-block mr-1">
                                <form role="search" className="app-search">
                                    <div className="form-group mb-0">
                                        <input type="text" className="form-control" placeholder="Search.." />
                                        <button type="submit"><i className="fa fa-search"></i></button>
                                    </div>
                                </form>
                            </li>
                            <LanguageMenu /> */}

                            <li className="dropdown notification-list list-inline-item d-none d-md-inline-block mr-1">
                                <Link onClick={this.toggleFullscreen} className="nav-link waves-effect" to="#" id="btn-fullscreen">
                                    <i className="mdi mdi-fullscreen noti-icon"></i>
                                </Link>
                            </li>

                            <NotificationMenu />
                            <ProfileMenu Logout={() => this.Logout()} Admintype={Admintype} />
                        </ul>
                        <ul className="list-inline menu-left mb-0">
                            {/* <li className="float-left">
                                <button onClick={this.sidebarToggle} className="button-menu-mobile open-left waves-effect">
                                    <i className="mdi mdi-menu"></i>
                                </button>
                            </li> */}

                            {/* <li className="d-none d-sm-block">
                                <Dropdown isOpen={this.state.create_menu} toggle={this.toggleCreate} className="pt-3 d-inline-block">
                                    <DropdownToggle className="btn btn-light" caret tag="a">
                                        Create {' '}{' '}{' '}
                                    </DropdownToggle>
                                    <DropdownMenu >
                                        <DropdownItem tag="a" href="#">Action</DropdownItem>
                                        <DropdownItem tag="a" href="#">Another action</DropdownItem>
                                        <DropdownItem tag="a" href="#">Something else here</DropdownItem>
                                        <div className="dropdown-divider"></div>
                                        <DropdownItem tag="a" href="#">Separated link</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </li> */}
                        </ul>
                    </nav>
                </div>
            </React.Fragment>
        );
    }
}

const mapStatetoProps = state => {
    const { is_large_state, adminAccess, siteInfo } = state.Layout;
    const { user } = state.Login;
    return { is_large_state, user, adminAccess, siteInfo };
}


export default (connect(mapStatetoProps, { isLarge, activateNonAuthLayout, ClearStore })(Topbar));
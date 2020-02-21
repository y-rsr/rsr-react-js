import React from 'react';
import { useSelector } from 'react-redux'
function Footer(props) {
    const info = useSelector(state => state.Layout), { siteInfo } = info
    return (
        <React.Fragment>
            <footer className="footer">
                © {new Date().getFullYear()} &nbsp;{siteInfo.footer}
                {/* <span className="d-none d-sm-inline-block"> - Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand</span>. */}
            </footer>
        </React.Fragment>
    );
}

export default Footer;







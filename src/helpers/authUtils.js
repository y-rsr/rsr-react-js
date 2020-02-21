import axios from 'axios';
import _ from 'lodash'
//Set the logged in user data in local session 
const setLoggeedInUser = (user) => {
    localStorage.setItem('user', user);
}

// Gets the logged in user data from local session 
const getLoggedInUser = () => {
    const user = localStorage.getItem('user');
    if (user)
        return user;
    return null;
}

//is user is logged in
const isUserAuthenticated = () => {
    return getLoggedInUser() !== null;
}

// Register Method
const postRegister = (url, data) => {
    return axios.post(url, data).then(response => {
        if (response.status >= 200 || response.status <= 299)
            return response.data;
        throw response.data;
    }).catch(err => {
        var message;
        if (err.response && err.response.status) {
            switch (err.response.status) {
                case 404: message = "Sorry! the page you are looking for could not be found"; break;
                case 500: message = "Sorry! something went wrong, please contact our support team"; break;
                case 401: message = "Invalid credentials"; break;
                default: message = err[1]; break;
            }
        }
        throw message;
    });

}

// Login Method
const postLogin = (url, data) => {
    return axios.post(url, data).then(response => {
        if (response.status === 400 || response.status === 500)
            throw response.data;
        return response.data;
    }).catch(err => {
        throw err[1];
    });
}

// postForgetPwd 
const postForgetPwd = (url, data) => {
    return axios.post(url, data).then(response => {
        if (response.status === 400 || response.status === 500)
            throw response.data;
        return response.data;
    }).catch(err => {
        throw err[1];
    });
}

const getAdminAccess = () => {
    return [
        {
            "view": false,
            'access': 'Owners',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Drivers',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Driver Accounts',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Agents',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Cars',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Repossessions',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Maintenance',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Claims',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Car Attributes',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Bookings',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Payments to Owners',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Messages',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Fee management',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Manage City',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Newsletters',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Lien Holders',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Static Pages',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Reviews',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Contact Us',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Subscribers',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Ambassador',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'GPS Tracking',
            "add": false,
            "edit": false,
            "delete": false
        },
        {
            "view": false,
            'access': 'Toll & Parking Tickets',
            "add": false,
            "edit": false,
            "delete": false
        }
    ]
}
const AccessCheckViewMenu = (access, superAdmin, name) => {
    if (!_.isEmpty(access)) {
        let check = _.get(access, name, false)
        if (check) {
            return true;
        } else {
            return false;
        }
    } else {
        if (superAdmin === 'superadmin') {
            return true
        } else {
            return false
        }
    }
}
const GetPagniationArray = (totalItems, currentPage, pageSize) => {
    // default to first page
    currentPage = currentPage || 1;

    // default page size is 10
    pageSize = pageSize || 10;

    // calculate total pages
    var totalPages = Math.ceil(totalItems / pageSize);
    var startPage, endPage;
    if (totalPages <= 5) {
        // less than 10 total pages so show all
        startPage = 1;
        endPage = totalPages;
    } else {
        // more than 10 total pages so calculate start and end pages
        if (currentPage <= 4) {
            startPage = 1;
            endPage = 5;
        } else if (currentPage + 5 >= totalPages) {
            startPage = totalPages - 4;
            endPage = totalPages;
        } else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }
    }

    // calculate start and end item indexes
    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    // create an array of pages to ng-repeat in the pager control
    var pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);
    // return object with all pager properties required by the view
    return {
        totalItems: totalItems,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        startIndex: startIndex,
        endIndex: endIndex,
        pages: pages
    };
}
const OngetImgSize = (file, callback) => {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.onload = () => {
            var result = { 'width': img.width, 'height': img.height };
            callback(result);
        }
        img.src = URL.createObjectURL(file);
    })
}



export { setLoggeedInUser, getLoggedInUser, isUserAuthenticated, AccessCheckViewMenu, postRegister, postLogin, postForgetPwd, getAdminAccess, GetPagniationArray, OngetImgSize }
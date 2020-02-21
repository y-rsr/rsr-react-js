import React, { useState } from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import { useParams } from 'react-router-dom'
import request from '../../helpers/api';
import { NotificationManager } from '../../components/ReactNotifications';
function OwnerOpenHour(props) {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const times = ['08:00AM', '09:00AM', '10:00AM', '11:00AM', 'NOON', '01:00PM', '02:00PM', '03:00PM', '04:00PM', '05:00PM', '06:00PM', '07:00PM']
    let [daysArray, SetdaysArray] = useState([])
    let [timeArray, SettimeArray] = useState([])
    const commondayshourschange = (e, type) => {
        let checkbox = e.target.checked
        if (!type) {
            if (checkbox) {
                let temparray = [...daysArray]
                temparray.push(e.target.value)
                SetdaysArray(temparray)
            } else {
                daysArray.pop(e.target.value)
                SetdaysArray(daysArray)
            }
        } else {
            if (checkbox) {
                let temptime = [...timeArray], value = e.target.value
                temptime.push(value)
                SettimeArray(temptime)
            } else {
                times.pop(e.target.value)
                SettimeArray(times)
            }
        }
    }
    const params = useParams()
    const Onsubmit = (e) => {
        request({
            url: `api/owner/${params.id}/edit/openhours`,
            method: 'PUT',
            data: {
                days: daysArray,
                hours: timeArray,
            }
        }).then(res => {
            if (res && res.status === 200) {
                props.history.push('/admin/owner/list')
            }
        }).catch(err => {
            if (err && err.status === 400) {
                NotificationManager.error(err.data[0].msg, 'ERROR', 3000, null, null, 'filled')
            }
        })
    }
    // useEffect(() => {
    //     days.map((value) => {
    //         if (document.getElementById(value)) {
    //             document.getElementById(value).checked = true;
    //         }
    //     })
    // }, [])

    return (
        <React.Fragment>
            <Container fluid>
                <div className="page-title-box">
                    <Row className="align-items-center">
                        <Col sm="6">
                            <h4 className="page-title">Open Hours</h4>
                        </Col>
                        <Col sm="6">
                        </Col>
                    </Row>
                </div>
                <Row>
                    <Col lg="12">
                        <Card>
                            <CardBody>
                                <div className='openhours'>
                                    <div className='form-group'>
                                        <label className='control-label col-sm-2 label_days'>Days</label>
                                        {days && days.map((value, index) => {
                                            // console.log(value)
                                            return <p key={index}>
                                                <input type='checkbox' id={value} value={value} onClick={(e) => { commondayshourschange(e) }} />
                                                <label>{value}</label>
                                            </p>
                                        })}
                                    </div>
                                    <div className='form-group'>
                                        <label className='control-label col-sm-2 label_days'>Hours</label>
                                        {times && times.map((value, index) => {
                                            // console.log(value)
                                            return <p key={index}>
                                                <input type='checkbox' id={value} value={value} onClick={(e) => { commondayshourschange(e, true) }} />
                                                <label>{value}</label>
                                            </p>
                                        })}
                                    </div>
                                </div>
                                <Button color='success' onClick={() => { Onsubmit() }}>Submit</Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
}

export default OwnerOpenHour;
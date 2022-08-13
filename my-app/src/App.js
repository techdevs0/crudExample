import React, { useEffect, useState } from "react";
import axios from 'axios';
import FileBase from 'react-file-base64';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faRemove } from '@fortawesome/free-solid-svg-icons'
import "./App.css";

const App = () => {
    const [post, setpost] = useState({
        creator: "",
        title: "",
        message: "",
        tags: [],
        selectedFile: ""
    });

    const [show, setShow] = useState(false);
    const [userData, setUserData] = useState([]);
    const handleClose = () => {
        setShow(false);
        setUser({ _id: "", firstName: "", lastName: "", phone: "", email: "", gender: "", program: "", country: "", address: "" })
    }
    const handleShow = () => setShow(true);
    const [validated, setValidated] = useState(false);
    const [user, setUser] = useState({ _id: "", firstName: "", lastName: "", phone: "", email: "", gender: "", program: "", country: "", address: "" });


    useEffect(() => {
        axios.get('http://localhost:3080/users').then((res) => setUserData(res.data))
            .catch((err) => console.log(err))
    }, [])

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        event.preventDefault();

        let data = { ...user }

        if (!data._id) {
            delete data._id;
            axios.post('http://localhost:3080/users', data)
                .then((res) => {
                    alert("User Added Successfully");
                    handleClose();
                    setUser({ firstName: "", lastName: "", phone: "", email: "", gender: "", program: "", country: "", address: "" })
                    console.log(res.data);
                    setUserData([...userData, res.data])
                })
                .catch((err) => {
                    alert("Something Went Wrong Try again later")
                })
        } else {
            let id = data._id;
            delete data._id;
            axios.put(`http://localhost:3080/users/${id}`, data)
                .then((res) => {
                    alert("User Added Successfully");
                    handleClose();
                    setUser({ firstName: "", lastName: "", phone: "", email: "", gender: "", program: "", country: "", address: "" })
                    const updatedUserData = userData.map(user => {
                        if (user._id === res.data._id) {
                            return res.data;
                        }

                        return user;
                    });
                    setUserData(updatedUserData)
                })
                .catch((err) => {
                    alert("Something Went Wrong Try again later")
                })
        }
    };

    const editUser = (id) => {
        let user = userData.find((user) => user._id === id);
        if (user) {
            setUser(user);
            handleShow();
        }
    }

    const deleteUser = (id) => {
        if (window.confirm("Are you Sure You want to Delete User ? ") === true) {
            axios.delete(`http://localhost:3080/users/${id}`)
                .then((res) => {
                    if (res.status == 200) {
                        alert("User Deleted Successfully")
                        setUserData(userData.filter((item) => item._id != id))
                    }
                }).catch((err) => console.log(err))
        }

    }

    const TableRow = ({ user, index }) => (
        <tr>
            <td>{index + 1}</td>
            <td>{user.firstName + " " + user.lastName}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
            <td>{user.country}</td>
            <td className="actionTd">
                <span style={{ cursor: 'pointer' }} onClick={(e) => editUser(user._id)}>
                    <FontAwesomeIcon icon={faEdit} />
                </span>
                <span style={{ cursor: 'pointer' }} onClick={(e) => deleteUser(user._id)}>
                    <FontAwesomeIcon icon={faRemove} size='xl' color='red' />
                </span>
            </td>
        </tr>
    )

    return (
        <Container style={{ marginTop: '100px', maxWidth: "1200px" }}>
            <div className="mainWrapper">
                <span className="mainTextWrapper">User Management System</span>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="title">
                        Users List
                    </h2>
                    <Button onClick={handleShow} className="btn-submit">
                        Add User
                    </Button>
                </div>
                <Table className="tableStyle" striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Country</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.length > 0 ? userData.map((user, index) => (
                            <TableRow key={user._id} user={user} index={index} />
                        )) :
                        <tr>
                            <td colSpan="5" className="noRecordTd">No Record Found</td>
                        </tr>
                        }
                    </tbody>
                </Table>
            </div>
            <Modal size="lg" show={show} onHide={handleClose} className="apply-now">
                <Form noValidate validated={validated} onSubmit={handleSubmit} className="query-form-column">
                    <Modal.Header closeButton>
                        <Modal.Title className="modal-title">Create User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="6" controlId="validationCustom01">
                                <Form.Label>First name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="First name"
                                    value={user.firstName}
                                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" controlId="validationCustom02">
                                <Form.Label>Last name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Last name"
                                    value={user.lastName}
                                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="6" controlId="validationCustomUsername">
                                <Form.Label>Phone Number</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        type="text"
                                        placeholder="Phone Number"
                                        aria-describedby="inputGroupPrepend"
                                        required
                                        value={user.phone}
                                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please Add Phone Number.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="6" controlId="validationCustomUsername">
                                <Form.Label>Email</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        type="email"
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        placeholder="Username"
                                        aria-describedby="inputGroupPrepend"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please Add an Email.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="6">
                                <Form.Label>Gender</Form.Label>
                                <Form.Select aria-label="Default select example" onChange={(e) => setUser({ ...user, gender: e.target.value })} value={user.gender} required>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} md="6">
                                <Form.Label>Interest</Form.Label>
                                <Form.Select aria-label="Default select example" onChange={(e) => setUser({ ...user, program: e.target.value })} value={user.program} required>
                                    <option value="">Select Interest</option>
                                    <option value="WebDevelopment">Web Development</option>
                                    <option value="MobileAppDevelopment">Mobile App Development</option>
                                    <option value="FrontEndDevelopment">Front End Development</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="12">
                                <Form.Label>Select Coountry</Form.Label>
                                <Form.Select aria-label="Default select example" onChange={(e) => setUser({ ...user, country: e.target.value })} value={user.country} required>
                                    <option value="">Select Country</option>
                                    <option value="Kuwait">Kuwait</option>
                                    <option value="UAE">UAE</option>
                                    <option value="KSA">KSA</option>
                                    <option value="INDIA">INDIA</option>
                                    <option value="PAKISTAN">PAKISTAN</option>
                                    <option value="CHAINA">CHAINA</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="12">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    value={user.address}
                                    onChange={(e) => setUser({ ...user, address: e.target.value })}
                                    placeholder="Leave a comment here"
                                    style={{ height: '100px' }}
                                    required
                                />
                            </Form.Group>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" className="btn-submit">
                            Submit
                        </Button>
                        <Button className="btnClose" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    )
}

export default App;
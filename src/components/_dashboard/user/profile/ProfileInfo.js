import { Box, Card, CardHeader } from '@mui/material';
import { Form, Row, Col, Button } from 'react-bootstrap';
import React, { useState } from "react";
export default function ProfileInfo() {
  const [tec, setTec] = useState([]);
  const [city, setCity] = useState([]);
  return (
    <Card>
      <CardHeader title="Update information" />
      <Box sx={{ mx: 3, mt: 5, ml: 5, mb: 5 }} dir="ltr">

        <Form>
          <input type="hidden" name="userid" id="userid" value="4" />
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" name="username" value="c+919033691699" placeholder="username" />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value="dhruvarora@example.com" placeholder="Enter email" />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label>First name</Form.Label>
              <Form.Control type="text" name="first_name" value="Dhruv" placeholder="First Name" />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="last_name" value="Arora" placeholder="Last Name" />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridDob">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="text" name="dob" value="1999-06-01" placeholder="Date of birth" />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridDob">
              <Form.Label>Gender</Form.Label>
              {['radio'].map((type) => (
                <div key={`inline-${type}`} className="mb-3">
                  <Form.Check
                    inline
                    label="Male"
                    name="group1"
                    type={type}
                    id={`inline-${type}-1`}
                  />
                  <Form.Check
                    inline
                    label="Female"
                    name="group1"
                    type={type}
                    id={`inline-${type}-2`}
                  />

                </div>
              ))}
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>Contact detail</Form.Label>
              <Form.Control type="text" name="mobile" value="9033691699" placeholder="contact details" />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Current City</Form.Label>
              <Form.Control type="text" name="current_location" value="Nadiad" placeholder="current location" />
            </Form.Group>

          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>Prefer City</Form.Label>
              <Form.Control as="select" multiple value={city} onChange={e => setCity([].slice.call(e.target.selectedOptions).map(item => item.value))}>
                <option value="ahmedabad">Ahmedabad</option>
                <option value="ghandinagar">Ghandinagar</option>
                <option value="vadodara">Vadodara</option>
                <option value="rajkot">Rajkot</option>
                <option value="pune">Pune</option>
                <option value="jaipur">Jaipur</option>
                <option value="mumbai">Mumbai</option>
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="formGridTechnology">
              <Form.Label>Technology</Form.Label>
              <Form.Control as="select" multiple value={tec} onChange={e => setTec([].slice.call(e.target.selectedOptions).map(item => item.value))}>
                <option value="php">PHP</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="Node">Node</option>
                <option value="angular">Angular</option>
                <option value="react">React</option>
              </Form.Control>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridNoticePeriod">
              <Form.Label>Notice Period</Form.Label>
              <Form.Control type="text" name="notice_period" value="3" placeholder="Notice Period" />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridTotalExperience">
              <Form.Label>Total Experience</Form.Label>
              <Form.Control type="text" name="total_experience" value="2" placeholder="Total Experience" />
            </Form.Group>

          </Row>

          <Form.Group className="mb-3" id="formGridCheckbox">
            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form.Group>
        </Form>
      </Box>
    </Card>
  );
}

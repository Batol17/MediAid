
import React, { useState } from 'react';
  import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import { Button, Form, Col, Row, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const Pharmacy = () => {
  const [medicines,setMedicines]=useState([])
  const [coordinates,setCoordinates]=useState([]);
  const [position, setPosition] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const setMedToPh = useSelector((state) => state.medicineToPh.form);

  setMedToPh &&  setMedicines(setMedToPh)
  const [pharmacyData, setPharmacyData] = useState({
    name: '',
    address: '',
    location: {
      coordinates: [0, 0],
    },
    phone: '',
    openingHours: '',
    imageUrl: '',
    description: '',
    services: [],
    socialMedia: {
      facebook: '',
      instagram: '',
    },
    website: '',
    medicines,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPharmacyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    const index = name === 'latitude' ? 0 : 1;
    setPharmacyData((prev) => {
      const newCoordinates = [...prev.location.coordinates];
      newCoordinates[index] = parseFloat(value);
      return {
        ...prev,
        location: {
          coordinates: newCoordinates,
        },
      };
    });
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setPharmacyData((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: value,
      },
    }));
  };

  const handleMedicinesChange = (index, field, value) => {
    const newMedicines = [...pharmacyData.medicines];
    newMedicines[index][field] = value;
    setPharmacyData((prev) => ({
      ...prev,
      medicines: newMedicines,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(pharmacyData);
  };
  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const newCoordinates = [coords.latitude, coords.longitude];
          setPosition(newCoordinates);
          setCoordinates(newCoordinates);
          setPharmacyData((prevData) => ({ ...prevData }));
          setShowMap(true);
        },
        () => alert('Failed to get location.')
      );
    } else {
      alert('Geolocation is not supported by this device.');
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formName">
        <Form.Label>اسم الصيدلية</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={pharmacyData.name}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formAddress">
        <Form.Label>العنوان</Form.Label>
        <Form.Control
          type="text"
          name="address"
          value={pharmacyData.address}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Row>
        {/* <Col>
          <Form.Group controlId="formLatitude">
            <Form.Label>خط العرض</Form.Label>
            <Form.Control
              type="number"
              name="latitude"
              value={pharmacyData.location.coordinates[0]}
              onChange={handleLocationChange}
              required
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formLongitude">
            <Form.Label>خط الطول</Form.Label>
            <Form.Control
              type="number"
              name="longitude"
              value={pharmacyData.location.coordinates[1]}
              onChange={handleLocationChange}
              required
            />
          </Form.Group>
        </Col> */}
          <div className="mt-2 w-100">
                        <input
                          type="text"
                          value={coordinates.join(', ')}
                          readOnly
                          placeholder="Select your location from the map"
                          className="user-input w-100"
                        />
                        <Button onClick={handleLocation} variant="secondary" className="btn my-1">
                          Select your location
                        </Button>
         {showMap && (
                          <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
                            <TileLayer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {position && (
                              <Marker position={position}>
                                <Popup>Your selected location</Popup>
                              </Marker>
                            )}
                          </MapContainer>
                        )}
                        </div>
      </Row>

      <Form.Group controlId="formPhone">
        <Form.Label>رقم الهاتف</Form.Label>
        <Form.Control
          type="text"
          name="phone"
          value={pharmacyData.phone}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="formOpeningHours">
        <Form.Label>ساعات العمل</Form.Label>
        <Form.Control
          type="text"
          name="openingHours"
          value={pharmacyData.openingHours}
          onChange={handleInputChange}
          required
          /> 
          </Form.Group>
          <Form.Group controlId="formImageUrl">
        <Form.Label>رابط الصورة</Form.Label>
        <Form.Control
          type="url"
          name="imageUrl"
          value={pharmacyData.imageUrl}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formDescription">
        <Form.Label>الوصف</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={pharmacyData.description}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="formServices">
        <Form.Label>الخدمات</Form.Label>
        {['Delivery', '24/7 Service', 'Home Delivery'].map((service) => (
          <Form.Check
            key={service}
            type="checkbox"
            label={service}
            value={service}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setPharmacyData((prev) => ({
                ...prev,
                services: isChecked
                  ? [...prev.services, service]
                  : prev.services.filter((s) => s !== service),
              }));
            }}
          />
        ))}
      </Form.Group>

      <Row>
        <Col>
          <Form.Group controlId="formFacebook">
            <Form.Label>فيسبوك</Form.Label>
            <Form.Control
              type="url"
              name="facebook"
              value={pharmacyData.socialMedia.facebook}
              onChange={handleSocialMediaChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formInstagram">
            <Form.Label>إنستغرام</Form.Label>
            <Form.Control
              type="url"
              name="instagram"
              value={pharmacyData.socialMedia.instagram}
              onChange={handleSocialMediaChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="formWebsite">
        <Form.Label>الموقع الإلكتروني</Form.Label>
        <Form.Control
          type="url"
          name="website"
          value={pharmacyData.website}
          onChange={handleInputChange}
        />
      </Form.Group>

      {/* Medicines Section */}
      {pharmacyData.medicines.map((medicine, index) => (
        <div key={index}>
          <h5>دواء {index + 1}</h5>
          <Row>
            <Col>
              <Form.Group controlId={`formMedicineId${index}`}>
                <Form.Label>معرف الدواء</Form.Label>
                <Form.Control
                  type="text"
                  value={medicine.medicineId}
                  onChange={(e) =>
                    handleMedicinesChange(index, 'medicineId', e.target.value)
                  }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId={`formQuantity${index}`}>
                <Form.Label>الكمية</Form.Label>
                <Form.Control
                  type="number"
                  value={medicine.quantity}
                  onChange={(e) =>
                    handleMedicinesChange(index, 'quantity', parseInt(e.target.value))
                  }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId={`formPrice${index}`}>
                <Form.Label>السعر</Form.Label>
                <Form.Control
                  type="number"
                  value={medicine.price}
                  onChange={(e) =>
                    handleMedicinesChange(index, 'price', parseFloat(e.target.value))
                  }
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
      ))}

      <Button variant="primary" type="submit">
        إرسال
      </Button>
    </Form>
    </Container>
  );
};

export default Pharmacy;
          
          


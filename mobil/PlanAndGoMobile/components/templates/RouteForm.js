import React from 'react';
import { View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import MapPreview from './MapPreview';
import WaypointList from './WaypointList';
import { routeValidations } from '../utils/validations';

export default function RouteForm({ 
  initialValues, 
  onSubmit, 
  isEdit = false 
}) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={routeValidations}
      onSubmit={onSubmit}
    >
      {({ 
        handleChange, 
        handleBlur, 
        handleSubmit, 
        values, 
        errors, 
        touched,
        setFieldValue
      }) => (
        <View style={{ padding: 20 }}>
          <TextInput
            placeholder="Rota Başlığı"
            value={values.title}
            onChangeText={handleChange('title')}
            onBlur={handleBlur('title')}
            style={styles.input}
          />
          {touched.title && errors.title && 
            <Text style={styles.error}>{errors.title}</Text>}

          <View style={styles.mapContainer}>
            <MapPreview
              startPoint={values.start_point}
              destination={values.destination}
              waypoints={values.waypoints}
              onLocationSelect={(type, coords) => {
                if(type === 'start') {
                  setFieldValue('start_point', coords);
                } else {
                  setFieldValue('destination', coords);
                }
              }}
            />
          </View>

          <WaypointList
            waypoints={values.waypoints}
            onAdd={(waypoint) => 
              setFieldValue('waypoints', [...values.waypoints, waypoint])
            }
            onRemove={(index) => 
              setFieldValue('waypoints', values.waypoints.filter((_, i) => i !== index))
            }
            onUpdate={(index, field, value) => {
              const updated = [...values.waypoints];
              updated[index][field] = value;
              setFieldValue('waypoints', updated);
            }}
          />

          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>
              {isEdit ? 'Güncelle' : 'Oluştur'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  error: {
    color: 'red',
    marginBottom: 10
  },
  mapContainer: {
    height: 200,
    marginVertical: 15,
    borderRadius: 10,
    overflow: 'hidden'
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  }
};
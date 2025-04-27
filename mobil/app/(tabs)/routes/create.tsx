import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { routeApi } from '@/utils/ApiService';
import Colors from '@/constants/Colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Header from '@/components/Header';
import { Calendar, MapPin, X } from 'lucide-react-native';

const RouteSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  start_date: Yup.string().required('Start date is required'),
  end_date: Yup.string().required('End date is required'),
  start_latitude: Yup.number().required('Start point latitude is required'),
  start_longitude: Yup.number().required('Start point longitude is required'),
  destination_latitude: Yup.number().required('Destination latitude is required'),
  destination_longitude: Yup.number().required('Destination longitude is required'),
  is_shared: Yup.boolean(),
  waypoints: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Waypoint name is required'),
      latitude: Yup.number().required('Latitude is required'),
      longitude: Yup.number().required('Longitude is required'),
    })
  ),
});

type Waypoint = {
  name: string;
  latitude: number;
  longitude: number;
};

export default function CreateRouteScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const handleCreateRoute = async (values: any) => {
    try {
      setError(null);
      
      // Format data to match API expectations
      const routeData = {
        title: values.title,
        start_point: `POINT(${values.start_longitude} ${values.start_latitude})`,
        destination: `POINT(${values.destination_longitude} ${values.destination_latitude})`,
        start_date: values.start_date,
        end_date: values.end_date,
        is_shared: values.is_shared,
        waypoints: values.waypoints.map((waypoint: Waypoint, index: number) => ({
          name: waypoint.name,
          order: index + 1,
          latitude: waypoint.latitude,
          longitude: waypoint.longitude,
        })),
      };
      
      const response = await routeApi.createRoute(routeData);
      
      if (response && response.id) {
        Alert.alert('Success', 'Route created successfully!');
        router.push('/(tabs)/routes');
      }
    } catch (err: any) {
      console.error('Error creating route:', err);
      setError(err.response?.data?.detail || 'Failed to create route. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Create Route" showBackButton />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create a New Route</Text>
        <Text style={styles.subtitle}>Plan your journey with waypoints</Text>
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        <Formik
          initialValues={{
            title: '',
            start_date: '2025-11-01T09:00:00Z',
            end_date: '2025-11-05T18:00:00Z',
            start_latitude: 41.0082,
            start_longitude: 28.9784,
            destination_latitude: 41.0655,
            destination_longitude: 29.0060,
            is_shared: false,
            waypoints: [{ name: '', latitude: 0, longitude: 0 }],
          }}
          validationSchema={RouteSchema}
          onSubmit={handleCreateRoute}
        >
          {({ 
            handleChange, 
            handleBlur, 
            handleSubmit, 
            values, 
            errors, 
            touched, 
            isSubmitting,
            setFieldValue
          }) => (
            <View style={styles.form}>
              <Input
                label="Route Title"
                placeholder="Enter route title"
                value={values.title}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                error={touched.title && errors.title ? errors.title : undefined}
              />
              
              <View style={styles.dateContainer}>
                <View style={styles.dateField}>
                  <Input
                    label="Start Date"
                    placeholder="YYYY-MM-DDT00:00:00Z"
                    value={values.start_date}
                    onChangeText={handleChange('start_date')}
                    onBlur={handleBlur('start_date')}
                    error={touched.start_date && errors.start_date ? errors.start_date : undefined}
                  />
                </View>
                <View style={styles.dateField}>
                  <Input
                    label="End Date"
                    placeholder="YYYY-MM-DDT00:00:00Z"
                    value={values.end_date}
                    onChangeText={handleChange('end_date')}
                    onBlur={handleBlur('end_date')}
                    error={touched.end_date && errors.end_date ? errors.end_date : undefined}
                  />
                </View>
              </View>
              
              <Text style={styles.sectionTitle}>Start Point</Text>
              <View style={styles.locationContainer}>
                <View style={styles.locationField}>
                  <Input
                    label="Latitude"
                    placeholder="Enter latitude"
                    value={values.start_latitude.toString()}
                    onChangeText={(text) => setFieldValue('start_latitude', parseFloat(text) || 0)}
                    keyboardType="numeric"
                    error={
                      touched.start_latitude && errors.start_latitude 
                        ? errors.start_latitude.toString() 
                        : undefined
                    }
                  />
                </View>
                <View style={styles.locationField}>
                  <Input
                    label="Longitude"
                    placeholder="Enter longitude"
                    value={values.start_longitude.toString()}
                    onChangeText={(text) => setFieldValue('start_longitude', parseFloat(text) || 0)}
                    keyboardType="numeric"
                    error={
                      touched.start_longitude && errors.start_longitude 
                        ? errors.start_longitude.toString() 
                        : undefined
                    }
                  />
                </View>
              </View>
              
              <Text style={styles.sectionTitle}>Destination</Text>
              <View style={styles.locationContainer}>
                <View style={styles.locationField}>
                  <Input
                    label="Latitude"
                    placeholder="Enter latitude"
                    value={values.destination_latitude.toString()}
                    onChangeText={(text) => setFieldValue('destination_latitude', parseFloat(text) || 0)}
                    keyboardType="numeric"
                    error={
                      touched.destination_latitude && errors.destination_latitude 
                        ? errors.destination_latitude.toString() 
                        : undefined
                    }
                  />
                </View>
                <View style={styles.locationField}>
                  <Input
                    label="Longitude"
                    placeholder="Enter longitude"
                    value={values.destination_longitude.toString()}
                    onChangeText={(text) => setFieldValue('destination_longitude', parseFloat(text) || 0)}
                    keyboardType="numeric"
                    error={
                      touched.destination_longitude && errors.destination_longitude 
                        ? errors.destination_longitude.toString() 
                        : undefined
                    }
                  />
                </View>
              </View>
              
              <Text style={styles.sectionTitle}>Waypoints</Text>
              {values.waypoints.map((waypoint, index) => (
                <View key={index} style={styles.waypointContainer}>
                  <View style={styles.waypointHeader}>
                    <Text style={styles.waypointTitle}>Waypoint {index + 1}</Text>
                    {index > 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          const newWaypoints = [...values.waypoints];
                          newWaypoints.splice(index, 1);
                          setFieldValue('waypoints', newWaypoints);
                        }}
                        style={styles.removeButton}
                      >
                        <X size={16} color={Colors.error[500]} />
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  <Input
                    label="Name"
                    placeholder="Enter waypoint name"
                    value={waypoint.name}
                    onChangeText={(text) => {
                      const newWaypoints = [...values.waypoints];
                      newWaypoints[index].name = text;
                      setFieldValue('waypoints', newWaypoints);
                    }}
                    error={
                      touched.waypoints && 
                      errors.waypoints && 
                      (errors.waypoints as any)[index]?.name
                        ? (errors.waypoints as any)[index].name
                        : undefined
                    }
                  />
                  
                  <View style={styles.locationContainer}>
                    <View style={styles.locationField}>
                      <Input
                        label="Latitude"
                        placeholder="Enter latitude"
                        value={waypoint.latitude.toString()}
                        onChangeText={(text) => {
                          const newWaypoints = [...values.waypoints];
                          newWaypoints[index].latitude = parseFloat(text) || 0;
                          setFieldValue('waypoints', newWaypoints);
                        }}
                        keyboardType="numeric"
                        error={
                          touched.waypoints && 
                          errors.waypoints && 
                          (errors.waypoints as any)[index]?.latitude
                            ? (errors.waypoints as any)[index].latitude.toString()
                            : undefined
                        }
                      />
                    </View>
                    <View style={styles.locationField}>
                      <Input
                        label="Longitude"
                        placeholder="Enter longitude"
                        value={waypoint.longitude.toString()}
                        onChangeText={(text) => {
                          const newWaypoints = [...values.waypoints];
                          newWaypoints[index].longitude = parseFloat(text) || 0;
                          setFieldValue('waypoints', newWaypoints);
                        }}
                        keyboardType="numeric"
                        error={
                          touched.waypoints && 
                          errors.waypoints && 
                          (errors.waypoints as any)[index]?.longitude
                            ? (errors.waypoints as any)[index].longitude.toString()
                            : undefined
                        }
                      />
                    </View>
                  </View>
                </View>
              ))}
              
              <Button
                title="Add Waypoint"
                onPress={() => {
                  setFieldValue('waypoints', [
                    ...values.waypoints,
                    { name: '', latitude: 0, longitude: 0 },
                  ]);
                }}
                type="outline"
                style={styles.addWaypointButton}
              />
              
              <Button
                title="Create Route"
                onPress={() => handleSubmit()}
                loading={isSubmitting}
                style={styles.createButton}
              />
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[800],
    marginBottom: 8,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.neutral[600],
    marginBottom: 24,
    fontFamily: 'Inter_400Regular',
  },
  form: {
    width: '100%',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateField: {
    width: '48%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[800],
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationField: {
    width: '48%',
  },
  waypointContainer: {
    backgroundColor: Colors.neutral[50],
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  waypointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  waypointTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[800],
    fontFamily: 'Inter_600SemiBold',
  },
  removeButton: {
    padding: 4,
  },
  addWaypointButton: {
    marginBottom: 24,
  },
  createButton: {
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: Colors.error[500] + '20',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error[500],
  },
  errorText: {
    color: Colors.error[500],
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});
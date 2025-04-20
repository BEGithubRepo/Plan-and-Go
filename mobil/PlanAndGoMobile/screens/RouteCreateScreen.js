import { Formik } from 'formik';
import * as yup from 'yup';
import { RouteService } from '../services/api';

const validationSchema = yup.object().shape({
  start_point: yup.string().required('Başlangıç noktası zorunlu'),
  destination: yup.string().required('Varış noktası zorunlu'),
  start_date: yup.date().required(),
  end_date: yup.date().min(yup.ref('start_date'), 'Bitiş tarihi geçersiz'),
  waypoints: yup.array().of(
    yup.object().shape({
      name: yup.string().required(),
      latitude: yup.number().required(),
      longitude: yup.number().required(),
    })
  )
});

export default function RouteCreateScreen({ navigation }) {
  const handleSubmit = async (values) => {
    try {
      const response = await RouteService.createRoute(values);
      navigation.navigate('RouteDetail', { id: response.data.id });
    } catch (error) {
      Alert.alert('Hata', error.response.data.message);
    }
  };

  return (
    <Formik
      initialValues={{
        start_point: '',
        destination: '',
        start_date: new Date(),
        end_date: new Date(),
        waypoints: []
      }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({ handleChange, handleSubmit, values, errors }) => (
        <ScrollView>
          <TextInput
            placeholder="Başlangıç Noktası"
            value={values.start_point}
            onChangeText={handleChange('start_point')}
          />
          {errors.start_point && <Text>{errors.start_point}</Text>}

          <WaypointList 
            waypoints={values.waypoints}
            onAdd={(wp) => setFieldValue('waypoints', [...values.waypoints, wp])}
            onRemove={(index) => setFieldValue('waypoints', values.waypoints.filter((_, i) => i !== index))}
          />

          <Button title="Rota Oluştur" onPress={handleSubmit} />
        </ScrollView>
      )}
    </Formik>
  );
}
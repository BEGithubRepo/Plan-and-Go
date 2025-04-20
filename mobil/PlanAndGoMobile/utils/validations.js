import * as yup from 'yup';

export const routeValidations = yup.object().shape({
  title: yup
    .string()
    .required('Rota başlığı zorunlu')
    .max(50, 'En fazla 50 karakter girebilirsiniz'),
  
  start_point: yup
    .object()
    .required('Başlangıç noktası seçmelisiniz')
    .shape({
      latitude: yup.number().required(),
      longitude: yup.number().required(),
      address: yup.string().required()
    }),
  
  destination: yup
    .object()
    .required('Varış noktası seçmelisiniz')
    .shape({
      latitude: yup.number().required(),
      longitude: yup.number().required(),
      address: yup.string().required()
    }),

  start_date: yup
    .date()
    .required('Başlangıç tarihi zorunlu')
    .min(new Date(), 'Geçmiş tarih seçemezsiniz'),

  end_date: yup
    .date()
    .required('Bitiş tarihi zorunlu')
    .min(yup.ref('start_date'), 'Bitiş tarihi başlangıçtan önce olamaz'),

  waypoints: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Durak adı zorunlu'),
      latitude: yup.number().required(),
      longitude: yup.number().required(),
      arrival_time: yup.date().nullable()
    })
  )
});

export const loginValidation = yup.object().shape({
  email: yup
    .string()
    .email('Geçerli bir email girin')
    .required('Email zorunlu'),
  
  password: yup
    .string()
    .required('Şifre zorunlu')
    .min(6, 'En az 6 karakter olmalı')
});
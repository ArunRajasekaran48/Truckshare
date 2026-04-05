import * as yup from 'yup';

const requiredPositiveNumber = (label) =>
  yup
    .number()
    .transform((value, originalValue) => {
      // Prevent Yup from showing raw NaN cast errors for empty numeric inputs.
      return originalValue === '' || originalValue == null ? undefined : value;
    })
    .typeError(`${label} must be a valid number`)
    .required(`${label} is required`)
    .positive('Must be positive');

export const loginSchema = yup.object({
  userId: yup.string().required('User ID is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export const registerSchema = yup.object({
  userId: yup
    .string()
    .min(3, 'User ID must be at least 3 characters')
    .max(30, 'User ID too long')
    .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores')
    .required('User ID is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[0-9]/, 'Must contain a number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
  phone: yup
    .string()
    .matches(/^\+?[0-9\-\s]{10,15}$/, 'Enter a valid phone number')
    .required('Phone is required'),
  role: yup.string().oneOf(['TRUCK_OWNER', 'BUSINESS_USER', 'DRIVER']).required('Select a role'),
});

export const truckSchema = yup.object({
  licensePlate: yup
    .string()
    .matches(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/, 'Format: MH01AB1234')
    .required('License plate is required'),
  model: yup.string().required('Model is required'),
  fromLocation: yup.string().required('Origin is required'),
  toLocation: yup
    .string()
    .required('Destination is required')
    .test('not-same', 'Origin and destination must differ', function (value) {
      return value !== this.parent.fromLocation;
    }),
  capacityWeight: yup.number().positive('Must be positive').required('Weight capacity required'),
  capacityVolume: yup.number().positive('Must be positive').required('Volume capacity required'),
  capacityLength: yup.number().positive('Must be positive').required('Length capacity required'),
  pricePerKg: yup.number().positive('Must be positive').required('Price per kg required'),
  pricePerLength: yup.number().positive('Must be positive').required('Price per meter required'),
  status: yup.string().oneOf(['AVAILABLE', 'IN_TRANSIT', 'MAINTENANCE', 'INACTIVE']).required(),
  points: yup
    .array()
    .of(
      yup.object({
        id: yup.string().nullable(),
        name: yup.string().required('Stop name'),
        type: yup.string().oneOf(['BOARDING', 'DROPPING']).required(),
        address: yup.string().nullable(),
        scheduledTime: yup.string().nullable(),
      })
    )
    .default([]),
});

export const shipmentRouteSchema = yup.object({
  fromLocation: yup.string().required('Origin is required'),
  toLocation: yup
    .string()
    .required('Destination is required')
    .test('not-same', 'Origin and destination must differ', function (value) {
      return value !== this.parent.fromLocation;
    }),
  requiredWeight: requiredPositiveNumber('Weight'),
  requiredVolume: requiredPositiveNumber('Volume'),
  requiredLength: requiredPositiveNumber('Length'),
});

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState } from 'react';

import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography
} from '@mui/material';
import {authRegisteredAction} from '../../store/auth/auth.action';
import CustomModal from '../../Modal/index';
const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const emailRef = useRef(null);
  const addressRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const usernameRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const passwordRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleDialogOpen = ()=>{
    setIsOpen(true);
  }
  const auth = useSelector((state) => state.auth);
  const handleDialogClose = ()=>{
    setIsOpen(false);
  }
  return (
    <>
        <title>Register | Material Kit</title>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              username : '',
              firstName: '',
              lastName: '',
              address : '',
              phoneNumber:'',
              password: '',
              confirmPassword: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
                // .test('checkEmailExists', 'This email is already registered', async email =>{
                //   const isExists = await AuthServices.existsByEmail(email);
                //   return !isExists;
                // }),
                username: Yup.string()
              .min(6, 'Username must between 6 and 50 characters')
              .max(50, 'Username must between 6 and 50 characters')
              .required('Username is required!'),
              // .test('checkUsernameExists', 'This username is already registered', async userName =>{
              //   const isExists = await AuthServices.existsByUsername(userName);
              //   return !isExists;
              // }),
              firstName: Yup.string()
                .max(255)
                .required('First name is required'),
              lastName: Yup.string().max(255).required('Last name is required'),
              password: Yup.string().max(255).required('Password is required'),
              confirmPassword: Yup.string()
              .required('Confirm password is required')
              .when("password",{
                is: value => (value && value.length>0 ? true : false),
                then: Yup.string().oneOf(
                  [Yup.ref("password")],
                  "Confirm password do not match"
                )
              })
            })}
            onSubmit={() => {
              dispatch(
                authRegisteredAction(
                  emailRef.current.value,
                  usernameRef.current.value,
                  firstNameRef.current.value,
                  lastNameRef.current.value,
                  addressRef.current.value,
                  phoneNumberRef.current.value,
                  passwordRef.current.value,
                  setEmail(emailRef.current.value),
                  handleDialogOpen(true),
                  navigate
                )
              );
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              handleClose,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography color="textPrimary" variant="h2">
                    Đăng ký tài khoản
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.username && errors.username)}
                  fullWidth
                  helperText={touched.username && errors.username}
                  label="Tài khoản"
                  margin="normal"
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  inputRef={usernameRef}
                  value={values.username}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.firstName && errors.firstName)}
                  fullWidth
                  helperText={touched.firstName && errors.firstName}
                  label="Họ"
                  margin="normal"
                  name="firstName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  inputRef={firstNameRef}
                  value={values.firstName}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.lastName && errors.lastName)}
                  fullWidth
                  helperText={touched.lastName && errors.lastName}
                  label="Tên"
                  margin="normal"
                  name="lastName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  inputRef={lastNameRef}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.address && errors.address)}
                  fullWidth
                  helperText={touched.address && errors.address}
                  label="Địa chỉ"
                  margin="normal"
                  name="address"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  inputRef={addressRef}
                  value={values.address}
                  variant="outlined"
                />
                 <TextField
                  error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                  fullWidth
                  helperText={touched.phoneNumber && errors.phoneNumber}
                  label="Số điện thoại"
                  margin="normal"
                  name="phoneNumber"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  inputRef={phoneNumberRef}
                  value={values.phoneNumber}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  inputRef={emailRef}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Mật khẩu"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  inputRef={passwordRef}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                  fullWidth
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  label="Xác nhận mật khẩu"
                  margin="normal"
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.confirmPassword}
                  variant="outlined"
                />
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    ml: -1
                  }}
                >
                </Box>
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Đăng ký
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1">
                  Bạn đã có tài khoản?{' '}
                  <Link component={RouterLink} to="/login" variant="h6">
                    Đăng nhập
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
          <CustomModal 
          isOpen={isOpen} 
          handleClose={handleDialogClose} 
          title='Bạn cần xác thực tài khoản !!'>
          <div>
          <p>Chúng tôi đã gửi một email tới <b>{email}</b></p>
            <p>Vui lòng kiểm tra email để xác thực tài khoản
            </p>
          </div>
          </CustomModal>
        </Container>
      
      </Box>
    </>
  );
};

export default Signup;
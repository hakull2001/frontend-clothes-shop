import {
    Alert,
    AlertTitle,
    Box,
    Button,
    CircularProgress,
    Container,
    Snackbar,
    TextField,
    Typography
  } from '@mui/material';
  import { Formik } from 'formik';
  import { useRef } from 'react';
  import { useDispatch, useSelector } from 'react-redux';
  import { Link, useNavigate, Link as RouterLink } from 'react-router-dom';
  import {
    authSignInAsyncAction, resetError
  } from '../../store/auth/auth.action';
  import * as Yup from 'yup';
  
  const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    const auth = useSelector((state) => state.auth);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const handleClose = () => {
      dispatch(resetError());
    };
  
    return (
      <>
          <title>Login | Material Kit</title>
        <Box
          sx={{
            backgroundColor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
            textTransform:'none'
          }}
        >
          <Container maxWidth="sm">
            <Formik
              initialValues={{
                username: 'hadepchai',
                password: '26113012a'
              }}
              validationSchema={Yup.object().shape({
                username: Yup.string()
                  .required('username bắt buộc'),
                password: Yup.string().max(255).required('Mật khẩu bắt buộc')
              })}
              onSubmit={() => {
                dispatch(
                  authSignInAsyncAction(
                    usernameRef.current.value,
                    passwordRef.current.value,
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
                touched,
                values
              }) => (
                <form onSubmit={handleSubmit}>
                  <Box sx={{ mb: 3 }}>
                    <Typography color="textPrimary" variant="h2">
                      Đăng nhập
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
                    type="text"
                    value={values.username}
                    variant="outlined"
                    inputRef={usernameRef}
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
                    variant="outlined"
                    inputRef={passwordRef}
                  />
                  <Box sx={{ py: 2 }}>
                    <Button
                      color="primary"
                      disabled={auth.isLoading}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                    >
                      {auth.isLoading ? (
                        <CircularProgress size={26} />
                      ) : (
                        'Đăng nhập'
                      )}
                    </Button>
                  </Box>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Typography color="textSecondary" variant="body1">
                    Bạn quên
                    <Link
                      component={RouterLink}
                      to="/forget-password"
                      variant="h6"
                    >
                      Mật khẩu ?
                    </Link>
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    Bạn chưa có tài khoản
                    {' '}
                    <Link
                      component={RouterLink}
                      to="/sign-up"
                      variant="h6"
                    >
                      Đăng ký
                    </Link>
                  </Typography>
                </div>
                </form>
              )}
            </Formik>
          </Container>
          {auth.error !== '' && (
            <Snackbar
              open={auth.error !== ''}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              autoHideDuration={3000}
              onClose={handleClose}
              size={30}
            >
              <Alert severity="error">
                <AlertTitle>Đã có lỗi xảy ra</AlertTitle>
                <strong>{auth.error}</strong>
              </Alert>
            </Snackbar>
          )}
        </Box>
        
      </>
    );
  };
  
  export default Login;
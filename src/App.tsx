import { Box, CircularProgress, Container, Stack, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import Header from './components/Header';
import Onboarding from './components/Onboarding';
import EditProfile from './components/EditProfile';
import EventEditor from './components/Event/EventEditor';
import { WithFirebaseApiProps, withFirebaseApi } from './Firebase';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { RootState } from './redux/store';
import { handleUserChange } from './redux/userSlice';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import EventViewer from './components/Event/EventViewer';


const isLoadingState = (state: RootState): boolean => {
  return state.user.userId === undefined;
};

const Body = () => {
  const userId = useAppSelector((state: RootState) => state.user.userId);
  const userInfo = useAppSelector((state: RootState) => state.user.userInfo.value);
  const userInfoLoadState = useAppSelector((state: RootState) => state.user.userInfo.loadState);
  if (userId === null) {
    // logged out user
    return (<>
      <Typography>Please Log In</Typography>
    </>);
  }

  if (userInfoLoadState === "loading") {
    return <CircularProgress />;
  }
  if (userInfoLoadState === "failed" || userInfo === undefined) {
    return (<>
      <Typography>Something failed</Typography>
    </>);
  }
  if (userInfo === null) {
    return <Onboarding />;
  }
  return (
    <Routes>
      <Route path="/" element={<>
        <Typography>{`Welcome ${userInfo.username}`}</Typography>
        <EditProfile />
      </>} />
      <Route path="/event/new" element={<EventEditor eventId={null} />} />
      <Route path="/event/:eventId" element={<EventViewer />} />
    </Routes>
  );
};

const App = (props: WithFirebaseApiProps) => {
  const isLoading = useAppSelector(isLoadingState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return props.firebaseApi.onAuthStateChanged((user) => {
      if (user) {
        dispatch(handleUserChange(props.firebaseApi, user.uid));
      } else {
        dispatch(handleUserChange(props.firebaseApi, null));
      }
    });
  }, []);

  if (isLoading) {
    return <CircularProgress sx={{ margin: "auto" }} />;
  }
  return (
    <BrowserRouter>
      <Header />
      <Container sx={{ paddingTop: 3 }}>
        <Box sx={{ margin: "auto" }}>
          <Body />
        </Box>
      </Container>
    </BrowserRouter>
  );
}

export default withFirebaseApi(App);

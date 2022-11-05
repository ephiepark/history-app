import { Typography, Stack, TextField, Button } from "@mui/material";
import { useState } from "react";
import { WithFirebaseApiProps, withFirebaseApi } from "../../Firebase";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { asyncSetUserInfo } from "../../redux/userSlice";

const OnboardingBase = (props: WithFirebaseApiProps) => {
  const userId = useAppSelector((state: RootState) => state.user.userId);
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  let selectedProfilePic = null;
  if (file !== null) {
    selectedProfilePic = <img src={URL.createObjectURL(file!)} width={200} />;
  }
  return (<>
    <Typography variant="h2" component="div" align="left">
      Finish setting up your account
    </Typography>
    <Stack direction="row" spacing={2}>
      <Typography variant="body1" align="left" sx={{ marginTop: "auto", marginBottom: "auto" }}>
        Username:
      </Typography>
      <TextField
        value={username}
        label="Edit Username"
        onChange={(e) => setUsername(e.target.value)}
      />
    </Stack>
    {selectedProfilePic}
    <Button variant="contained" component="label">
      Upload
      <input hidden accept="image/*" onChange={(e) => {
        const files = e.target.files;
        if (files == null || files.length === 0) {
          setFile(null);
        } else {
          setFile(files[0]);
        }
      }} type="file" />
    </Button>
    <Button
      variant="contained"
      sx={{ marginTop: 2 }}
      onClick={async () => {
        const handle = await props.firebaseApi.asyncUploadImage(userId!, file!);
        dispatch(asyncSetUserInfo({
          firebaseApi: props.firebaseApi,
          userId: userId!,
          userInfo: {
            username: username,
            profilePicHandle: handle,
            isEditor: false,
          },
        }))
      }}
      disabled={file === null || username.length === 0}
    >SUBMIT</Button>
  </>);
}

export default withFirebaseApi(OnboardingBase);

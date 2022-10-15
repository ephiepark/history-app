import { WithFirebaseApiProps, withFirebaseApi } from "../../Firebase";
import { Box, Stack, TextField, Button, CircularProgress, Typography, Autocomplete } from "@mui/material";
import { useEffect, useState } from "react";
import { UserInfo } from "../../types";
import { useParams } from "react-router-dom";
import { EventWithId } from "../../types";

const EventViewerBase = (props: WithFirebaseApiProps) => {
  const [event, setEvent] = useState<EventWithId | null>(null);
  const [author, setAuthor] = useState<UserInfo | null>(null);
  const params = useParams();

  useEffect(() => {
    props.firebaseApi.asyncGetEvent(params.eventId!).then((event: EventWithId | null) => {
      setEvent(event);
    });
  }, []);
  useEffect(() => {
    if (event?.userId == null) {
      return;
    }
    props.firebaseApi.asyncGetUserInfo(event!.userId).then((userInfo: UserInfo | null) => {
      setAuthor(userInfo);
    });
  }, [event?.userId]);

  if (params.eventId == null) {
    return <Typography>Something went wrong...</Typography>;
  }
  if (event === null || author === null) {
    return <CircularProgress />;
  }
  return (<Stack>
    <Typography>{`Title: ${event.title}`}</Typography>
    <Typography>{`Author: ${author.username}`}</Typography>
    <Typography>{`Created Time: ${event.createdTime}`}</Typography>
    <Autocomplete
      multiple
      id="tags-outlined"
      filterSelectedOptions
      options={event.tags}
      value={event.tags}
      renderInput={(params) => (
        <TextField
          {...params}
          label="tags"
          placeholder="Tags"
        />
      )}
      readOnly
    />
    <Typography>{`Event Time: ${event.eventTime}`}</Typography>
    <Typography>{`Description: ${event.description}`}</Typography>
  </Stack>);
}

export default withFirebaseApi(EventViewerBase);

import { Typography, TextField, Autocomplete, Button } from "@mui/material";
import { useState } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import { eventTags } from "../../types";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";

const EventEditorBase = (props: {
  eventId: string | null,
} & WithFirebaseApiProps) => {
  const userId = useAppSelector((state: RootState) => state.user.userId);
  const [title, setTitle] = useState<string>('');
  const [eventTime, setEventTime] = useState<string>('');
  const [tags, setTags] = useState<Array<string>>([]);
  const [description, setDescription] = useState<string>('');
  const content = props.eventId === null ? 'Add new event' : 'Edit new event';
  const initState = () => {
    setTitle('');
    setEventTime('');
    setTags([]);
    setDescription('');
  }
  const handleSubmit = async () => {
    await props.firebaseApi.asyncCreateEvent({
      title,
      description,
      eventTime,
      tags,
      userId: userId!,
      createdTime: Math.floor(Date.now() / 1000),
    });
    initState();
  };
  return (
    <>
      <Typography>{content}</Typography>
      <TextField
        id="title"
        label="Title"
        variant="outlined"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        id="date"
        label="Event Date"
        type="date"
        sx={{ width: 220 }}
        InputLabelProps={{
          shrink: true,
        }}
        value={eventTime}
        onChange={(e) => {
          setEventTime(e.target.value);
        }}
      />
      <Autocomplete
        multiple
        id="tags-outlined"
        options={eventTags}
        filterSelectedOptions
        value={tags}
        onChange={(_e, v) => {
          setTags(v);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="filterSelectedOptions"
            placeholder="Favorites"
            onChange={(e) => {
              console.log('aaa', e.target.value);
            }}
          />
        )}
      />
      <TextField
        id="outlined-textarea"
        label="Event Description"
        placeholder="Event Description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        multiline
      />
      <Button variant="contained" onClick={handleSubmit}>Submit</Button>
    </>
  );
};

export default withFirebaseApi(EventEditorBase);

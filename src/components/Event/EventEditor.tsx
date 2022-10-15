import { Typography, TextField, Autocomplete } from "@mui/material";
import { useState } from "react";
import { eventTags } from "../../types";

const EventEditor = (props: {
  eventId: string | null,
}) => {
  const [title, setTitle] = useState<string>('');
  const [eventTime, setEventTime] = useState<string>('');
  const [tags, setTags] = useState<Array<string>>([]);
  const [description, setDescription] = useState<string>('');
  const content = props.eventId === null ? 'Add new event' : 'Edit new event';
  console.log(eventTime);
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
    </>
  );
};

export default EventEditor;

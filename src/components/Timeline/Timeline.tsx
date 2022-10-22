import { Autocomplete, CircularProgress, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import { eventTags, EventWithId } from "../../types";
import EventCard from "../Event/EventCard";

const TimelineBase = (props: WithFirebaseApiProps) => {
  const [events, setEvents] = useState<null | Array<EventWithId>>(null);
  const [tags, setTags] = useState<Array<string>>(eventTags);
  useEffect(() => {
    setEvents(null);
    if (tags.length > 0) {
      props.firebaseApi.asyncGetTimeline(tags).then((events) => setEvents(events));
    }
  }, [tags]);
  let body = null;
  if (tags.length === 0) {
    body = <Typography>There needs to be at least one tag</Typography>;
  } else if (events === null) {
    body = <CircularProgress />;
  } else {
    body = events.map((event) => <EventCard key={event.id} event={event} />);
  }
  return <Stack spacing={2}>
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
          label="tags"
          placeholder="Tags"
        />
      )}
    />
    {body}
  </Stack>;
};

export default withFirebaseApi(TimelineBase);

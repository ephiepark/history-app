import { CircularProgress } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import { EventWithId } from "../../types";
import EventCard from "../Event/EventCard";

const TimelineBase = (props: WithFirebaseApiProps) => {
  const [events, setEvents] = useState<null | Array<EventWithId>>(null);
  useEffect(() => {
    props.firebaseApi.asyncGetTimeline().then((events) => setEvents(events));
  }, []);

  if (events === null) {
    return <CircularProgress />;
  }
  return <Stack spacing={2}>
    {events.map((event) => <EventCard key={event.id} event={event} />)}
  </Stack>;
};

export default withFirebaseApi(TimelineBase);

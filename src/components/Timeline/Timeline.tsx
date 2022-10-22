import { CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import { EventWithId } from "../../types";

const TimelineBase = (props: WithFirebaseApiProps) => {
  const [events, setEvents] = useState<null | Array<EventWithId>>(null);
  useEffect(() => {
    props.firebaseApi.asyncGetTimeline().then((events) => setEvents(events));
  }, []);

  if (events === null) {
    return <CircularProgress />;
  }
  return <>{events.map((event) => <Typography key={event.id}>{event.title}</Typography>)}</>;
};

export default withFirebaseApi(TimelineBase);

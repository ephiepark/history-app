import { Box, Typography } from "@mui/material";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import { EventWithId } from "../../types";

const EventCardBase = (props: {event: EventWithId} & WithFirebaseApiProps) => {
  return <Box>
    <Typography>{props.event.title}</Typography>
    <Typography>{props.event.eventTime}</Typography>
    <Typography>{props.event.tags}</Typography>
    <Typography>{props.event.description}</Typography>
  </Box>;
};

export default withFirebaseApi(EventCardBase);

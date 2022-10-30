import { Button, CircularProgress, Grid, Stack } from "@mui/material";
import { useState } from "react";
import { EventWithId } from "../../types";
import { EventWithTimelineMetadata, TimelineFilter, TimelineViewer } from "./Timeline";

const mergeTimelineEvents = (timelines: Array<{
  timelineKey: string,
  events: Array<EventWithId> | null,
}>): Array<EventWithTimelineMetadata> => {
  const allEvents = timelines.map((timeline) => timeline.events?.map((event) => {
    return {
      timelineMetadata: {
        timelineKey: timeline.timelineKey,
      },
      event: event,
    };
  }) ?? []).flat();
  allEvents.sort((a, b) => {
    if (a.event.eventTime > b.event.eventTime) {
      return -1;
    } else if (a.event.eventTime < b.event.eventTime) {
      return 1;
    }
    return 0;
  });
  return allEvents;
};

export default () => {
  const [timelines, setTimelines] = useState<Array<{
    timelineKey: string,
    events: Array<EventWithId> | null,
  }>>([{
    timelineKey: 'main',
    events: null
  }]);
  const addTimelineButton = timelines.length >= 2 ? null : <Button onClick={() => {
    setTimelines([
      ...timelines,
      {
        timelineKey: `${Math.floor(Date.now() / 1000)}`,
        events: null,
      },
    ]);
  }}>Add Timeline</Button>;
  const isLoading = timelines.some((timeline) => timeline.events === null);
  const body = isLoading ? <CircularProgress /> : <TimelineViewer events={mergeTimelineEvents(timelines)} />;
  return <Stack>
    {addTimelineButton}
    <Grid container spacing={2}>
      {timelines.map((timelineIt) => {
        return <Grid key={timelineIt.timelineKey} item xs={Math.floor(12 / timelines.length)}>
          <Stack>
            <Button onClick={() => {
              setTimelines(timelines.filter((timeline) => timeline.timelineKey !== timelineIt.timelineKey))
            }}>Remove</Button>
            <TimelineFilter timelineKey={timelineIt.timelineKey} setEvents={(timelineKey, events) => {
              setTimelines(timelines.map((timeline) => {
                if (timeline.timelineKey !== timelineKey) {
                  return timeline;
                }
                return {
                  timelineKey: timelineKey,
                  events: events,
                };
              }))
            }} />
          </Stack>
        </Grid>;
      })}
    </Grid>
    {body}
  </Stack>;
};

import { Button, CircularProgress, Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { EventWithId, Filter, SavedFilter } from "../../types";
import { EventWithTimelineMetadata, TimelineFilter, TimelineViewer } from "./Timeline";

const mergeTimelineEvents = (timelines: Array<{
  timelineKey: string,
  events: Array<EventWithId> | null,
}>): Array<EventWithTimelineMetadata> => {
  const allEvents = timelines.map((timeline, index) => timeline.events?.map((event) => {
    return {
      timelineMetadata: {
        timelineKey: timeline.timelineKey,
        index: index,
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

const SavedFilterHomeBase = (props: WithFirebaseApiProps) => {
  const [savedFilter, setSavedFilter] = useState<SavedFilter | null>(null);
  const params = useParams();

  useEffect(() => {
    if (params.savedFilterId == null) {
      return;
    }
    props.firebaseApi.asyncGetSavedFilter(params.savedFilterId).then((savedFilter) => setSavedFilter(savedFilter));
  }, [params.savedFilterId]);

  if (savedFilter === null) {
    return <CircularProgress />;
  }

  return <Home initialFilters={savedFilter.savedFilters} />;
};

export const SavedFilterHome = withFirebaseApi(SavedFilterHomeBase);

const HomeBase = (props: {
  initialFilters: Array<Filter>,
} & WithFirebaseApiProps) => {
  const userId = useAppSelector((state: RootState) => state.user.userId!);
  const [timelines, setTimelines] = useState<Array<{
    timelineKey: string,
    filter: Filter,
    events: Array<EventWithId> | null,
  }>>(props.initialFilters.map((initialFilter, index) => {
    return {
      timelineKey: `${index}`,
      filter: initialFilter,
      events: null
    }
  }));
  const addTimelineButton = timelines.length >= 2 ? null : <Button onClick={() => {
    setTimelines([
      ...timelines,
      {
        timelineKey: `${Math.floor(Date.now() / 1000)}`,
        filter: { tagIds: [] },
        events: null,
      },
    ]);
  }}>Add Timeline</Button>;
  const isLoading = timelines.some((timeline) => timeline.events === null);
  const body = isLoading ? <CircularProgress /> : <TimelineViewer events={mergeTimelineEvents(timelines)} columnSize={12 / timelines.length} spacing={2} numTimeline={timelines.length} />;
  return <Stack>
    <Button onClick={async () => {
      await props.firebaseApi.asyncCreateSavedFilter({
        savedFilters: timelines.map((timeline) => timeline.filter),
        userId: userId,
        createdTime: Math.floor(Date.now() / 1000),
      });
    }}>Save Filter</Button>
    {addTimelineButton}
    <Grid container spacing={2}>
      {timelines.map((timelineIt) => {
        return <Grid key={timelineIt.timelineKey} item xs={Math.floor(12 / timelines.length)}>
          <Stack>
            <Button onClick={() => {
              setTimelines(timelines.filter((timeline) => timeline.timelineKey !== timelineIt.timelineKey))
            }}>Remove</Button>
            <TimelineFilter timelineKey={timelineIt.timelineKey} filter={timelineIt.filter}
              setEvents={(timelineKey, events) => {
                setTimelines((prevTimelines) => {
                  return prevTimelines.map((timeline) => {
                    if (timeline.timelineKey !== timelineKey) {
                      return timeline;
                    }
                    return {
                      ...timeline,
                      events: events,
                    };
                  })
                })
              }}
              setFilter={(timelineKey, filter) => {
                setTimelines((prevTimelines) => {
                  return prevTimelines.map((timeline) => {
                    if (timeline.timelineKey !== timelineKey) {
                      return timeline;
                    }
                    return {
                      ...timeline,
                      filter: filter,
                    }
                  })
                })
              }} />
          </Stack>
        </Grid>;
      })}
    </Grid>
    {body}
  </Stack>;
};

const Home = withFirebaseApi(HomeBase);

export default Home;

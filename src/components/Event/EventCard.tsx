import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Autocomplete, Avatar, Box, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Collapse, IconButton, IconButtonProps, styled, TextField, Typography } from "@mui/material";
import { withFirebaseApi, WithFirebaseApiProps } from "../../Firebase";
import { EventWithId, getTagsFromIds, UserInfo } from "../../types";
import { useEffect, useState } from "react";
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const EventCardBase = (props: { event: EventWithId } & WithFirebaseApiProps) => {
  const tags = useAppSelector((state: RootState) => state.tag.tags.value!);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [eventImageUrl, setEventImageUrl] = useState<string | null | undefined>(undefined);
  const [author, setAuthor] = useState<UserInfo | null>(null);
  const [authorImageUrl, setAuthorImageUrl] = useState<string | null | undefined>(undefined);


  useEffect(() => {
    if (props.event.imageHandle === null) {
      setEventImageUrl(null);
      return;
    }
    props.firebaseApi.asyncGetURLFromHandle(props.event.imageHandle).then((url) => {
      setEventImageUrl(url);
    });
  }, [props.event.imageHandle]);

  useEffect(() => {
    props.firebaseApi.asyncGetUserInfo(props.event.userId).then((userInfo: UserInfo | null) => {
      setAuthor(userInfo);
    });
  }, [props.event.userId]);

  useEffect(() => {
    if (author === null) {
      setAuthorImageUrl(undefined);
      return;
    }
    if (author.profilePicHandle == null) {
      setAuthorImageUrl(null);
      return;
    }
    props.firebaseApi.asyncGetURLFromHandle(author.profilePicHandle).then((url) => {
      setAuthorImageUrl(url);
    });
  }, [author]);


  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (eventImageUrl === undefined || authorImageUrl === undefined) {
    return <CircularProgress />;
  }

  const cardMedia = eventImageUrl == null ? null : <CardMedia
    component="img"
    height="345"
    image={eventImageUrl ?? undefined}
    alt={'Add Image'}
  />;

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar
            alt={author?.username}
            src={authorImageUrl ?? undefined}
          />
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={props.event.title}
        subheader={props.event.eventTime}
      />
      {cardMedia}
      <CardContent>
        <Autocomplete
          multiple
          id="tags-outlined"
          filterSelectedOptions
          options={getTagsFromIds(tags, props.event.tags)}
          value={getTagsFromIds(tags, props.event.tags)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="tags"
              placeholder="Tags"
            />
          )}
          getOptionLabel={(option) => option.tagName}
          readOnly
        />
      </CardContent>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {props.event.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      {/* comment? <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            {props.event.description}
          </Typography>
        </CardContent>
      </Collapse> */}
    </Card>
  );
};

export default withFirebaseApi(EventCardBase);

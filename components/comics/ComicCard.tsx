import {
  Card,
  CardActionArea,
  CardHeader,
  CardMedia,
  Grid,
} from "@mui/material";
import React, { FC } from "react";
import { Comic } from "../../interfaces";

interface Props {
  comic: Comic;
}

export const ComicCard: FC<Props> = ({ comic }) => {
  return (
    <Grid item xs={12} sm={6} md={4} xl={2} key={comic._id}>
      <Card sx={{ border: comic.nsfw ? "1px solid red" : "" }}>
        <CardActionArea href={`/comic/${comic._id}`}>
          <CardMedia
            component={"img"}
            image={`/api/comic/get/${comic._id}/image`}
            alt={comic.name}
          />
          <CardHeader title={comic.name} />
        </CardActionArea>
      </Card>
    </Grid>
  );
};

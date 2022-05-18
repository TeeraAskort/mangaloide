import { Card, CardHeader, Grid } from "@mui/material";
import React, { FC } from "react";
import { Comic } from "../../interfaces";
import { ComicCard } from "./ComicCard";

interface Props {
  comics: Comic[];
}

export const ComicList: FC<Props> = ({ comics }) => {
  return (
    <Grid item xs={12} md={8} lg={10}>
      {comics.length !== 0 ? (
        <Grid container justifyContent="center" spacing={2}>
          {comics.map((comic) => (
            <ComicCard key={comic._id} comic={comic} />
          ))}
        </Grid>
      ) : (
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={12} sm={6} md={4} xl={2}>
            <Card>
              <CardHeader title="There are no comics" />
            </Card>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

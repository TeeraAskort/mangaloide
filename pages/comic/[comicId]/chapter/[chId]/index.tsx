import { GetServerSidePropsContext } from "next";
import { MainLayout } from "../../../../../layouts";
import { db } from "../../../../../database";
import { ComicModel } from "../../../../../models";
import { Chapter } from "../../../../../interfaces";
import { FC } from "react";
import { useRouter } from "next/router";
import { Grid } from "@mui/material";
import Image from "next/image";

interface Props {
  chapter: Chapter;
  redirect: boolean;
}

const ChapterViewer: FC<Props> = ({ chapter, redirect }) => {
  const router = useRouter();

  if (redirect) {
    const { comicId } = router.query;
    router.push(`/comic/${comicId}`);
  }

  const { comicId } = router.query;

  let pages: number[] = [...Array(chapter.pages)].map(
    (value, index) => index + 1
  );

  return (
    <MainLayout title={chapter.name}>
      <Grid container spacing={2} justifyContent="center" alignContent="center">
        {pages.map((num) => (
          <Grid item key={num} xs={12} sm={10}>
            <Image
              key={num}
              src={`/api/comic/${comicId}/chapter/${chapter._id}/page/${num}`}
              alt={`Page ${num}`}
              layout="responsive"
              width="100%"
              height="100%"
              objectFit="contain"
            />
          </Grid>
        ))}
      </Grid>
    </MainLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { chId, comicId } = context.params!;

  await db.connect();

  const comic = await ComicModel.findById(comicId);

  if (!comic) {
    return {
      props: {
        redirect: true,
      },
    };
  }

  if (comic.chapters.length === 0) {
    return {
      props: {
        redirect: true,
      },
    };
  }

  const chapter = comic!.chapters.filter(
    (chapter) => chapter._id!.toString() === chId
  );

  if (chapter) {
    return {
      props: {
        chapter: chapter.map((chapter) => {
          return {
            _id: chapter!._id!.toString(),
            name: chapter!.name,
            pages: chapter!.pages,
            chNumber: chapter!.chNumber,
            language: chapter!.language,
          };
        })[0],
      },
    };
  } else {
    return {
      props: {
        redirect: true,
      },
    };
  }
}

export default ChapterViewer;

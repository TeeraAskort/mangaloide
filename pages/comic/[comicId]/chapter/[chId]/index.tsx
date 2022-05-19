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
}

const ChapterViewer: FC<Props> = ({ chapter }) => {
  const router = useRouter();

  const { comicId } = router.query;

  let pages: number[] = [...Array(chapter.pages)].map((_, index) => index + 1);

  return (
    <MainLayout title={chapter.name}>
      <Grid container spacing={2} justifyContent="center" alignContent="center">
        {pages.map((num) => (
          <Grid item key={num} xs={12} sm={10}>
            <Image
              key={num}
              src={`/api/comic/get/${comicId}/chapter/${chapter._id}/page/${num}`}
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

  const comic = await ComicModel.findById(comicId).select("chapters").lean();

  if (!comic) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (comic.chapters.length === 0) {
    return {
      redirect: {
        destination: `/comic/${comicId}`,
        permanent: false,
      },
    };
  }

  const chapter = comic!.chapters.find(
    (chapter) => chapter._id!.toString() === chId
  );

  if (chapter) {
    return {
      props: {
        chapter: JSON.parse(JSON.stringify(chapter)),
      },
    };
  } else {
    return {
      redirect: {
        destination: `/comic/${comicId}`,
        permanent: false,
      },
    };
  }
}

export default ChapterViewer;

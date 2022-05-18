import { Grid, Pagination } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, FC } from "react";
import { db } from "../../../../../../database";
import { Chapter } from "../../../../../../interfaces";
import { MainLayout } from "../../../../../../layouts";
import { ComicModel } from "../../../../../../models";

interface Props {
  chapter: Chapter;
}

const ChapterReadPaginated: FC<Props> = ({ chapter }) => {
  const router = useRouter();

  const { comicId, chId, pgNum } = router.query;

  const changePage = (event: ChangeEvent<unknown>, page: number) => {
    router.push(`/comic/${comicId}/chapter/${chId}/page/${page}`);
  };

  return (
    <MainLayout title={chapter.name}>
      <Link
        href={
          parseInt(pgNum as string) + 1 <= chapter.pages
            ? `/comic/${comicId}/chapter/${chId}/page/${
                parseInt(pgNum as string) + 1
              }`
            : `/comic/${comicId}`
        }
        passHref
      >
        <Image
          src={`/api/comic/get/${comicId}/chapter/${chId}/page/${pgNum}`}
          alt={`Page ${pgNum}`}
          layout="responsive"
          width="100%"
          height="100%"
          objectFit="contain"
          style={{ marginTop: "20px" }}
        />
      </Link>

      <Grid container sx={{ marginTop: 2 }} justifyContent="center">
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          xl={4}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Pagination
            onChange={changePage}
            count={chapter.pages}
            defaultPage={parseInt(pgNum as string)}
            showFirstButton
            showLastButton
          />
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { comicId, chId } = context.params!;

  await db.connect();

  const comic = await ComicModel.findById(comicId);

  if (!comic) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const chapter = comic.chapters.filter(
    (chapter) => chapter._id?.toString() === chId
  )[0];

  if (!chapter) {
    return {
      redirect: {
        destination: `/comic/${comicId}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      chapter: JSON.parse(JSON.stringify(chapter)),
    },
  };
}

export default ChapterReadPaginated;

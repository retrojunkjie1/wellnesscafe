import React from "react";
import PageBanner from "../components/PageBanner";
import NewsTicker from "../components/NewsTicker";
import NewsFeed from "../features/news/NewsFeed";

const NewsBlogsPage = () => {
  const banner = `${process.env.PUBLIC_URL}/images/rituals.jpg`;
  return (
    <div>
      <PageBanner imageSrc={banner} altText="Wellness news background">
        <NewsTicker />
      </PageBanner>
  <NewsFeed />
    </div>
  );
};

export default NewsBlogsPage;

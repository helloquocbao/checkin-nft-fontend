import React from "react";
import {
  Hero,
  Bids,
  Top_collection,
  Tranding_category,
  NewseLatter,
} from "@/components/component";
import Meta from "@/components/Meta";

const HomePage = () => {
  return (
    <main>
      <Meta title="Home 1" />
      <Hero />
      <Bids />
      <Top_collection />
      <Tranding_category />
      <NewseLatter />
    </main>
  );
};

export default HomePage;

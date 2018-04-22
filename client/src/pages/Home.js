import React from "react";
import Wrapper from "../Components/Wrapper";
import Hero from "../Components/Hero";
import NeighborhoodDropDown from "../Components/Search/NeighborhoodDropDown";
import Footer from "../Components/Footer";




const Home = () =>(
      <Wrapper>
        <Hero>
          <h1>Find Your Happy Hour</h1>
          <NeighborhoodDropDown />
        </Hero>
        <Footer />
      </Wrapper>
)

export default Home;
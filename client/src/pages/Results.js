import React, { Component } from "react";
import Wrapper from "../Components/Wrapper";
import Hero from "../Components/Hero";
import Container from "../Components/Container";
import Row from "../Components/Row";
import Col from "../Components/Col";
import BarCard from "../Components/BarCard";
import Footer from "../Components/Footer";
import FilterModal from "../Components/FilterModal";
import { Button } from "../Components/Search/Button";
import API from "../utils/API";
import { Link } from "react-router-dom";
import "./Results.css";
import neighborhoods from "../data/neighborhoods.js";
import Background from "./greybg.jpg";
import Logo from "../Components/Logo";

const wrapperStyle = {
  backgroundImage: `url(${Background})`,
  backgroundRepeat: "repeat"
};

const heroStyle = {
  fontSize: "1rem"
};

const resultsBtn = {
  marginLeft: "20px",
  marginRight: "20px"
};

class Results extends Component {
  state = {
    bars: []
  };

  componentDidMount() {
    window.scrollTo(0, 100);
    this.fetchBars(this.props.match.params.neighborhood);
    this.mounted = true;
    this.setState({
      modalOpen: false
    });
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
    console.log("toggler pressed");
  };

  componentWillUnmount() {
    this.mounted = false;
  }

  fetchBars(neighborhood) {
    if (neighborhood === "All Bars") {
      API.barFindAll()
        .then(res => {
          this.setState({ bars: res.data });
        })
        .catch(err => console.log(err));
      return;
    }
    API.queryNeighborhood(neighborhood)
      .then(res => {
        this.setState({ bars: res.data });
      })
      .catch(err => console.log(err));
  }

  filterBars(neighborhood, price, cuisine) {
    if (neighborhood === "All Bars") {
      API.queryFilters("null", price, cuisine).then(res => {
        console.log(res.data);
        this.setState({ bars: res.data });
        console.log(this.state.bars);
      });
      this.toggleModal.bind(this)();
      return;
    }
    API.queryFilters(neighborhood, price, cuisine).then(res => {
      console.log(res.data);
      this.setState({ bars: res.data });
      console.log(this.state.bars);
    });
    this.toggleModal.bind(this)();
  }

  findNeighborhoodImage(neighborhood) {
    return neighborhoods.filter(hood => hood.name === neighborhood);
  }

  convertPrice(int) {
    switch (int) {
      case 1:
        return "$";
      case 2:
        return "$$";
      case 3:
        return "$$$";
      default:
        return "No Price Available";
    }
  }

  render() {
    return (
      <Wrapper style={wrapperStyle}>
        <Logo />
        <Hero
          style={heroStyle}
          backgroundImage={
            this.findNeighborhoodImage(this.props.match.params.neighborhood)[0]
              .image
          }
        >
          <h1>{this.props.match.params.neighborhood}</h1>
          <div className="buttonDiv">
            <Link to="/">
              <Button style={resultsBtn}> Change Neighborhood</Button>
            </Link>
            <Button style={resultsBtn} handleClick={this.toggleModal}>
              Filter Bars
            </Button>
          </div>
          <FilterModal
            show={this.state.modalOpen}
            onClose={this.toggleModal}
            filterAPI={this.filterBars.bind(this)}
            toggle={this.toggleModal.bind(this)}
            neighborhood={this.props.match.params.neighborhood}
          />
        </Hero>
        <div className="card-results-wrapper">
          <Container>
            <Row>
              {/* Filter Conditional */}
              {/* If there are no bars found in the filter, render nothing found
                  Else render the bar cards */}
              {this.state.bars.length === 0 ? (
                <div className='noBarsFound'>
                  <h1> No Bars Found </h1>
                  <p> There are no bars that match your search criteria in this neighborhood.  Please try again or search in all bars category in the neighborhood selection.</p>
                  <Button handleClick={() => window.location.reload()}>
                    Clear Filter
                  </Button>
                </div>
              ) : (
                this.state.bars.map(bar => (
                  <Col size="sm-6 md-4">
                    <div className="results-container">
                      <div className="card-columns">
                        {/* modal conditional */}
                        {/* If the modal is not open, render the bar cards as links
                            Else  no links*/}
                        {!this.state.modalOpen ? (
                          <Link key={bar._id} to={`/bar/${bar._id}`}>
                            <BarCard
                              key={bar._id}
                              id={bar._id}
                              backgroundImage={bar.image}
                              image={bar.image}
                              name={bar.name}
                              cuisine={bar.cuisine}
                              neighborhood={bar.neighborhood}
                              startTime={bar.startTime}
                              endTime={bar.endTime}
                              price={this.convertPrice(bar.price)}
                            />
                          </Link>
                        ) : (
                          <BarCard
                            key={bar._id}
                            id={bar._id}
                            backgroundImage={bar.image}
                            image={bar.image}
                            name={bar.name}
                            cuisine={bar.cuisine}
                            neighborhood={bar.neighborhood}
                            startTime={bar.startTime}
                            endTime={bar.endTime}
                            price={this.convertPrice(bar.price)}
                          />
                        )}{" "}
                        {/* End of Modal Conditional*/}
                      </div>
                    </div>
                  </Col>
                ))
              )}{" "}
              {/* End of Filter Conditional */}
            </Row>
          </Container>
        </div>
        <Footer />
      </Wrapper>
    ); // end of return
  } // end of render
} // end of class Results extends Component

export default Results;

var React = require('react');
var Bootstrap = require('react-bootstrap');
var actions = require('../actions');

var {
    Navbar,
    NavItem,
    Nav,
    NavDropdown,
    MenuItem
} = Bootstrap;

var VisualNav = React.createClass({
    render: function() {
        return (
          <Navbar inverse fixedTop>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#">IMDB</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                <NavDropdown eventKey={3} 
                             title="Attributes" id="basic-nav-dropdown">
                  <MenuItem eventKey={"genres"} 
                            onSelect={actions.fetchSimilarity}>Genres</MenuItem>
                  <MenuItem eventKey={"countries"} 
                            onSelect={actions.fetchSimilarity}>Countries</MenuItem>
                  <MenuItem divider />
                  <MenuItem eventKey={3.3}>More to come</MenuItem>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        );
    }
});

module.exports = VisualNav;

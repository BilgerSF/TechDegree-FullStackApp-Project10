import React from "react";
import { NavLink,Link} from "react-router-dom";
import { Consumer } from "../App";
const ReactMarkdown = require("react-markdown");
const fetch = require("node-fetch");
//base64 encoder
const base64 = require("base-64");
var paragraphsJSX = [];
var itemsJSX = [];
let editFeature;
let courseId;

class CourseDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courseDetail: {
        User: "",
      },
    };
  }

  //fetches Course by ID from  REST API
  componentDidMount() {
    //Get course ID
    let URIlocation = this.props.location.pathname;
    courseId = URIlocation.slice(9);

    fetch(`http://localhost:5000/api/courses/${courseId}`)
      .then((response) => {
        if (response.status === 404) {
          this.props.history.push("/notfound");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ courseDetail: data });
      })
      .catch((error) => {
        console.error(error, "Server error.Status code: 500");
        this.props.history.push("/error");
      });
  }

  //Deletes course by ID from REST API
  deleteCourse(email, password) {
    fetch(`http://localhost:5000/api/courses/${courseId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${base64.encode(`${email}:${password}`)}`,
      },
    })
      .then((res) => {
        //redirect to courses list
        this.props.history.push("/");
      })
      .catch((error) => {
        console.error(error, "Server error.Status code: 500");
        this.props.history.push("/error");
      });
  }

  render() {
    //Returns update and delete features if the user is authorized and the course belongs to that user

    return (
      <Consumer>
        {(context) => {
          if (
            context.authenticated === true &&
            this.state.courseDetail.userId === context.userId
          ) {
            editFeature = (
              <span>
                <NavLink className="button" to={`/courses/${courseId}/update`}>
                  Update Course
                </NavLink>
                <button
                  className="button"
                  href="#"
                  onClick={() => {
                    this.deleteCourse(context.username, context.password);
                  }}
                >
                  Delete Course
                </button>
              </span>
            );
          } else {
            editFeature = "";
          }
          return (
            <div>
              <hr></hr>
              <div>
                <div className="actions--bar">
                  <div className="bounds">
                    <div className="grid-100">
                      {editFeature}

                      <Link to="/" className="button button-secondary">
                        Return to List
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="bounds course--detail">
                  <div className="grid-66">
                    <div className="course--header">
                      <h4 className="course--label">Course</h4>
                      <h3 className="course--title">
                        {this.state.courseDetail.title}
                      </h3>
                      <p>
                        By {this.state.courseDetail.User.firstName}{" "}
                        {this.state.courseDetail.User.lastName}
                      </p>
                    </div>
                    <div className="course--description">
                      <ReactMarkdown
                        source={this.state.courseDetail.description}
                      />

                      {paragraphsJSX.map((pJSX) => {
                        return pJSX;
                      })}
                    </div>
                  </div>
                  <div className="grid-25 grid-right">
                    <div className="course--stats">
                      <ul className="course--stats--list">
                        <li className="course--stats--list--item">
                          <h4>Estimated Time</h4>
                          <h3>{this.state.courseDetail.estimatedTime}</h3>
                        </li>
                        <li className="course--stats--list--item">
                          <h4>Materials Needed</h4>
                          <ReactMarkdown
                            source={this.state.courseDetail.materialsNeeded}
                          />
                          <ul>
                            {itemsJSX.map((itemJSX) => {
                              return itemJSX;
                            })}
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}

export default CourseDetail;

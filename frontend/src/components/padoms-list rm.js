import React, { useState, useEffect } from 'react';
import PadomsDataService from '../services/padoms';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
//import Alert from 'react-bootstrap/Alert';
import moment from 'moment';

const PadomsList = props => {
  const [padoms, setPadoms] = useState([]);

  useEffect(() => {
    retrievePadoms();
  }, [props.token]);

  useEffect(()=>[
    console.log("padoms-list.js ")
  ])

  const retrievePadoms = () => {
    PadomsDataService.getAll(props.token)
      .then(response => {
        setPadoms(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  const deletePadoms = (padomsId) => {
    PadomsDataService.deletePadoms(padomsId, props.token)
      .then(response => {
        retrievePadoms();
      })
      .catch(e => {
        console.log(e);
      });
  }

  const completePadoms = (padomsId) => {
    PadomsDataService.completePadoms(padomsId, props.token)
      .then(response => {
        retrievePadoms();
        console.log("completePadoms", padomsId);
      })
      .catch(e => {
        console.log(e);
      })
  }

  return (
    <Container>
        {/* <Alert variant='warning'>
          You are not logged in. Please <Link to={"/login"}>login</Link> to see your todos.
        </Alert> */}
      
        <div>
          <Link to={"/suggest/create"}>
            <Button variant="outline-info" className="mb-3">
              Add Pa-doms
            </Button>
          </Link>
          {padoms.map((padoms) => {
            return (
             
              <Card key={padoms.id} className="mb-3">
                <Card.Body>
                
                  <div className={`${padoms.completed ? "text-decoration-line-through" : ""}`}>
                    <Card.Title>{padoms.title}</Card.Title>
                    <Card.Text><b>Memo:</b> {padoms.memo}</Card.Text>
                    <Card.Text>
                      Date created: {moment(padoms.created).format("Do MMMM YYYY")}
                    </Card.Text>
                  </div>
                  {!padoms.completed &&
                    <Link to={{
                      pathname: "/padoms/" + padoms.id,
                      state: {
                        currentPadoms: padoms
                      }
                    }}>
                      <Button variant="outline-info" className="me-2">
                        Edit
                      </Button>
                    </Link>
                  }
                  <Button variant="outline-danger" onClick={() => deletePadoms(padoms.id)} className="me-2">
                    Delete
                  </Button>
                  <Button variant="outline-success" onClick={() => completePadoms(padoms.id)}>
                    Complete
                  </Button>
                </Card.Body>
              </Card>
            )
          })}
        </div>
      
    </Container>
  );
}

export default PadomsList;
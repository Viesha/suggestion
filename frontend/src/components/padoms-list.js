import React, { useState, useEffect } from 'react';
import PadomsDataService from '../services/padoms';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import moment from 'moment';

const PadomsList = props => {
  const [padoms, setPadoms] = useState([]);

  useEffect(() => {
    retrievePadoms();
  }, [props.token]);

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
      {props.token == null || props.token === "" ? (
        <Alert variant='warning'>
          You are not logged in. Please <Link to={"/login"}>login</Link> to see your todos.
        </Alert>
      ) : (
        <div>
          <Link to={"/suggest/create"}>
            <Button variant="outline-info" className="mb-3">
              Es sodien juku prata
            </Button>
            
          </Link>
          {padoms.map((padoms) => {
            return (
              <Card key={padoms.id} className="mb-3">
                <Card.Body>
                  <div className={`${padoms.completed ? "text-decoration-line-through" : ""}`}>
                    <Card.Title style={{fontSize: 25, textAlign: "center"}}><b>{padoms.title}</b></Card.Title>
                    <Card.Text style={{fontSize: 20, textAlign: "center"}}> {padoms.memo}</Card.Text>
                    <Card.Text style={{fontSize: 15, textAlign: "right"}}>
                      {moment(padoms.created).format('lll')}
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
      )}
    </Container>
  );
}

export default PadomsList;
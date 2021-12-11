import React, { Component } from 'react';
import { createClient, Provider, Query } from 'urql';


class ErrorMessage extends Component {
  constructor(props){
    super(props);

    let queryCallback = (result, _) => {
      const {data, fetching, error} = result;
      if (fetching) return <p>Loading...</p>
      if (error) return <p>Error receiving upload history: {error.message}.</p>
      let upload_data = data.students_csv_uploads[0];
      let upload_datetime = new Date(upload_data.time_uploaded).toString();
      if (upload_data.formatted_properly) {
        return (
          <p>Latest upload at {upload_datetime} with filename "{upload_data.filename}" was successful.</p>
        )
      } else {
        return (
          <p>Previous upload at {upload_datetime} with filename "{upload_data.filename}" failed with error "{upload_data.error}". </p>
        )
      }
    }

    this.state = {
      client: createClient({
        url: 'https://invested-backend.hasura.app/v1/graphql',
        fetchOptions: () => {
          return {
            headers: {
              "x-hasura-admin-secret":
                "6TE0h8u2vA7LdUi85VxdShf7d6tIX0DFncAjoy4cuQaCbSLcvCQPoK1gGOu5cziJ",
            },
          };
        },
      }),
      LatestUploadQuery: `
        query LatestUpload {
          students_csv_uploads(limit: 1, order_by: {time_uploaded: asc}) {
            filename
            error
            formatted_properly
            time_uploaded
          }
        }
      `,
      callback: queryCallback,
    };
  }

  render() {
    return (
      <Provider value={this.state.client}>
        <Query query={this.state.LatestUploadQuery} children={this.state.callback}/>
      </Provider>
    );
  }
}

export default ErrorMessage;

import React from 'react'
import { Card, Image } from 'semantic-ui-react'
import { getDoc } from '../api/docs-api'
import { Doc } from '../types/Doc'
import Auth from '../auth/Auth'

interface ViewDocState {
  doc: Doc
}

interface ViewDocProps {
  match: {
    params: {
      docId: string
    }
  }
  auth: Auth
}

export class ViewDoc extends React.PureComponent <ViewDocProps, ViewDocState> {
  state: ViewDocState = {
    doc: {
      docId: '',
      createdAt: '',
      title: ''
    }
  }

  async componentDidMount() {
    try {
      const doc = await getDoc(this.props.auth.getIdToken(), this.props.match.params.docId)
      this.setState({
        doc,
      })
    } catch (e) {
      alert(`Failed to fetch doc: ${(e as Error).message}`)
    }
  }
    
  render() {
    return (
      <Card fluid>
        <Image src={this.state.doc.attachmentUrl} wrapped size='medium' centered />
        <Card.Content>
          <Card.Header>
            {this.state.doc.title}
          </Card.Header>
          <Card.Meta>
            <span className='date'>Created at: {this.state.doc.createdAt}</span>
          </Card.Meta>
        </Card.Content>
      </Card>
    )
  }
}
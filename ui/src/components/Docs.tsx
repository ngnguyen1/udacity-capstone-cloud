import { History } from 'history'
// import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

// patchDoc
import { createDoc, deleteDoc, getDocs } from '../api/docs-api'
import Auth from '../auth/Auth'
import { Doc } from '../types/Doc'

interface DocsProps {
  auth: Auth
  history: History
}

interface DocsState {
  docs: Doc[]
  newDocTitle: string
  loadingDocs: boolean
}

export class Docs extends React.PureComponent<DocsProps, DocsState> {
  state: DocsState = {
    docs: [],
    newDocTitle: '',
    loadingDocs: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDocTitle: event.target.value })
  }

  onEditButtonClick = (docId: string) => {
    this.props.history.push(`/docs/${docId}/edit`)
  }

  onDocCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newDoc = await createDoc(this.props.auth.getIdToken(), {
        title: this.state.newDocTitle
      })
      this.setState({
        docs: [...this.state.docs, newDoc],
        newDocTitle: ''
      })
    } catch {
      alert('Doc creation failed')
    }
  }

  onDocDelete = async (docId: string) => {
    try {
      await deleteDoc(this.props.auth.getIdToken(), docId)
      this.setState({
        docs: this.state.docs.filter(doc => doc.docId !== docId)
      })
    } catch {
      alert('Doc deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const docs = await getDocs(this.props.auth.getIdToken())
      this.setState({
        docs,
        loadingDocs: false
      })
    } catch (e) {
      alert(`Failed to fetch docs: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">DOCS</Header>

        {this.renderCreateDocInput()}

        {this.renderDocs()}
      </div>
    )
  }

  renderCreateDocInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Create new doc',
              onClick: this.onDocCreate
            }}
            fluid
            actionPosition="left"
            placeholder="new docs..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderDocs() {
    if (this.state.loadingDocs) {
      return this.renderLoading()
    }
    return this.renderDocsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading documentation ...
        </Loader>
      </Grid.Row>
    )
  }

  renderDocsList() {
    return (
      <Grid padded>
        {this.state.docs.map(doc => {
          return (
            <Grid.Row key={doc.docId}>
              <Grid.Column width={10} verticalAlign="middle">
                {doc.title}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {doc.createdAt}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(doc.docId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onDocDelete(doc.docId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {doc.attachmentUrl && (
                <Image src={doc.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}

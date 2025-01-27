import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import Auth from '../../lib/auth'

import CommentCard from '../comments/CommentCard'
import CommentForm from '../comments/CommentForm'

class BlogShow extends React.Component {
  constructor() {
    super()

    this.state = {
      blogs: null,
      commentFormData: {
        comment: ''
      },
      errors: ''
    }
    
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  componentDidMount() {
    const blogId = this.props.match.params.id
    axios.get(`/api/blogs/${blogId}`)
      .then(res => this.setState({ blogs: res.data }))
      .catch(err => this.setState({ errors: err.response.data.errors }))
  }

  handleSubmit(e) {
    e.preventDefault()
    const blogId = this.props.match.params.id
    axios.post(`/api/blogs/${blogId}/comments/`, this.state.commentFormData , {
      headers: { Authorization: 'Bearer ' + Auth.getToken() }
    })
      .then(() => location.reload())
      .catch(err => this.setState({ errors: err.response.data.errors  }))
  }

  // { Authorization: `Bearer ${Auth.getToken()}` }

  handleChange(e) {
    const commentFormData = { ...this.state.commentFormData, [e.target.name]: e.target.value }
    this.setState({ commentFormData })
  }

  handleDelete(e) {
    axios.delete(`/api/comments/${e.target.value}/`, {
      headers: { Authorization: 'Bearer ' + Auth.getToken() }
    })
      .then(() => location.reload())
      .catch(err => this.setState({ errors: err.response.data.errors }))
  }

  render() {
    if (!this.state.blogs) return null
    console.log(this.state.blogs.comments)
    const { blogs } = this.state
    return (
      <>
      <div className="blogshow-wrapper">
        <section className="blogshow-images centre">
          <div className="blogshow-title">
            <h2>{blogs.title}</h2>
            <p className="blog-caps">Date Published: {blogs.date_published}</p>
          </div>

          <div className="blowshow-image-wrapper centre">
            {blogs.images.map(image => (
              // <img className="blogshow-images-column" key={image.id} src={'http://localhost:8000' + image.image}/>
              <img className="blogshow-images-column" key={image.id} src={image.image}/>
            ))}
          </div>
        </section>

        <div className="vertical-line"></div>

        <section className="blogshow-text">
          
          <h3>{blogs.subtitle}</h3>
          <p className="blog-caps">Authored By: {blogs.author}</p>
          <p className="blog-story">{blogs.story}</p>
          
          <div>
            {blogs.tags.map(tag => (
              <p className="blogshow-tags" key={tag.id}>{tag.tag}</p>
            ))}
          </div>

          <br/>

          <div>
            <Link to={`/blogs/${blogs.id}/edit`}>
              <button className="btn">Edit Blog</button>
            </Link>
          </div>

        </section>
      </div>

      <div className="blogshow-comments">
        <CommentForm
          commentFormData={this.state.commentFormData}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
        {blogs.comments.map(comment => (
          <CommentCard key={comment.id} {...comment}
            handleDelete={this.handleDelete}
          />
        ))}        
      </div>

      </>
    )
  }

}

export default BlogShow
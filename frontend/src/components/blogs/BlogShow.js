import React from 'react'
import axios from 'axios'
// import Auth from '../../lib/auth'

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
      headers: { Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjJ9.Iwn581UGM4D23SnUyTkbeiX57TVdjr9zy9mBQ1ZZIc4' }
    })
      .then(console.log('submitted'))
      .then(() => this.props.history.push(`/api/blogs/${blogId}`))
      .catch(err => this.setState({ errors: err.response.data.errors  }))
  }

  // { Authorization: `Bearer ${Auth.getToken()}` }

  handleChange(e) {
    console.log(e.target.name, e.target.value)
    const commentFormData = { ...this.state.commentFormData, [e.target.name]: e.target.value }
    this.setState({ commentFormData })
  }


  render() {
    if (!this.state.blogs) return null
    console.log(this.state.blogs.comments)
    const { blogs } = this.state
    return (
      <>
      <div className="blogshow-wrapper">
        <section className="blogshow-images">
          {blogs.images.map(image => (
            <img className="blogshow-images" key={image.id} src={'http://localhost:8000' + image.image}/>
          ))}
        </section>

        <hr/>

        <section className="blogshow-text">
          <h2>{blogs.title}</h2>
          <h4>{blogs.subtitle}</h4>
          <p className="blog-caps">Date Published: {blogs.date_published}</p>
          <p>{blogs.story}</p>
          <p className="blog-caps">Authored By: {blogs.author}</p>
          <div>
            {blogs.tags.map(tag => (
              <p className="blogshow-tags" key={tag.id}>{tag.tag}</p>
            ))}
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
          <CommentCard key={comment.id}/>
        ))}        
      </div>

      </>
    )
  }

}

export default BlogShow
## Pages
- Home
- Browse (posts and notes - notes filtered out by default)
- Admin (hidden)
- post/\<slug>
- note/\<slug>
- post/\<slug>/edit (admin-only)
- note/\<slug>/edit (admin-only)

---

## API Functions
- Create new post/note
- Edit existing post/note
- Delete existing post/note (24 hour recovery)
- Add new comment (stretch goal)
- Create account (stretch goal; not required for comments - you can comment as a guest 3 times per IP address per month)

---

## Goals
**June 12**:
- Create a Neon Postgres database and link it to the website
- Write an API route to create a new blog post
- Create the blog post writing page and have it use the new API route. Use the markdown editor component from the React component library being used
- Make the new post page admin-only/password-protected

**June 13**:
- Create the /post/\<slug> page that renders a blog post in Markdown formatting
- Create the browse page that lists all blog posts in chronological order

**June 14**:
- Create a new database for images and maybe videos and add an embedded image uploader to the blog post editor

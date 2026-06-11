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
**June 11**:
- Create a Neon Postgres database and link it to the website
- Write an API route to create a new blog post
- Create a page that lets you test the API route.

**June 12**:
- Turn the API tester page into a blog post writing page. Use the markdown editor component from the React component library being used
- Make the new post page admin-only/password-protected

**June 13**:
- Create the /post/\<slug> page that renders a blog post in Markdown formatting
- Create the browse page that lists all blog posts in chronological order

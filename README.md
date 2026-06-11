# Creating My Dev Blog

<small>June 10th, 2026</small>

Welcome to my first dev blog post. As I'm writing this, I currently have not started building the website you are
reading this on. Today, my main goal is to begin work on that website, and possibly finish the MVP of the website by
tomorrow with little to no AI assistance. This is especially going to be a challenge since I've fallen into the AI trap
and find it extremely difficult to not use AI at all even for a single day, especially when styling my websites.

I already have a satire dev blog, but the posts are all just markdown (for content) and json (for metadata) files in the
project folder itself on GitHub. I have to create those files and push a commit every time I want to post something.
That's not optimal, and I can easily do better. However, I won't be upgrading that system today. Instead, I'll be using
it as an example of what not to do this time. I'm going to set up a free database for my posts and a password-protected
hidden admin page for adding and managing posts. For my stretch goals, I'm thinking of adding a view counter, comments
on my posts, and sign up for email notification whenever I post a dev blog. For now though, let's focus on the MVP.

For my tech stack, I'll be using my usual Next.js, React, TailwindCSS, and TypeScript. As for my database, while I
prefer Supabase, I already have the free max of 2 projects in there, so I'm going with Neon serverless Postgres, which
can be easily integreted into a Next.js app on Vercel, which is where I'll be hosting my dev blog. Now, let me go begin
work on the website...

As I write this paragraph, I'm setting up the base of the website, undoing the Next.js template and selecting my desired 
fonts. For default text, I chose Gltp Starion, a somewhat futuristic but legible font that I use as my system font on 
my computer. For monospace/code blocks, I chose Victor Mono, which is also a somewhat futuristic font that I use in my
IDE. For titles, I chose Aquire, which isn't free for commercial use, so this is somewhat in a legal gray zone, but I 
plan to purchase a license for it anyway, as I'm using it in my WIP website that markets myself as a freelancing web 
developer. Aquire is a very futuristic font, which fits the font theme I'm going for. As a high-tech guy whose favorite
genre is sci-fi, I think these are very fitting fonts for a personal dev blog.

Already, I've hit my first battle with my instincts to use AI for coding assistance. I always use my inline AI coding
assistant for adding font faces to my CSS file. I can never remember the correct syntax for adding font faces. Luckily, 
I still have the internet, as well as code from previous projects. This will only set me back a couple of minutes.

For the color scheme, I'm reusing the same scheme as my freelancing website, [Zytronium WebWorks](https://webworks.zytronium.dev).
Speaking of which, if you ever need a quick website done right, I'm always happy to help, please consider checking out 
my website to compare my pricing and services with other options. I work in Oklahoma but will do work for clients 
anywhere.

I have the base of the website down, but it's just a blank slate. Now I need to come up with a general layout and 
style for the website. It'll be hard to beat my satire dev blog's design, which took hours of tweaking components from
a partially functional React component library to get it working, not to mention a ton of AI-assisted debugging. I don't
want to go down that path again. As much as I love the designs of my satire dev blog and freelancing website, I want
to go with an easier, more simple design that won't require as much AI assistance to get looking good. I might still
use a React component library, though. Time to go browsing modern, clean, semi-futuristic, easy to use component 
libraries.

I found a great-looking and very diverse component library, called UntitledUI (what a creative name...). However, many
of their components require you to pay for the entire library to use. The price is a whopping $350 USD. Yeah, no thanks.
I found Kibo-UI, which isn't a full component library, but has some components I want to use. Perfect. I can create my
own buttons and whatever else I want to use. I just need to more complex stuff like a markdown editor, zoomable image,
etc. Unfortunately, the docs on how to install this are no clear at all. I'm having a lot of trouble getting a single
component installed. I wouldn't recommend this library for people who have not used component libraries before or haven't
used one in a while. I guess I need yet another component library in order to use this component library. I chose Radix
\+ Nova since those are the first options. I have no idea what I'm actually installing but hope it won't matter at all.
Let's load the base website and see if it looks the same... Uh oh, it doesn't. That's not a good sign. Let's try adding
some stuff...

It seems tailwind is working, but my globals.css isn't setting the background and foreground colors. The easy fix is just
to add the default background and foreground colors to layout.tsx. Actually, looking at globals.css, I see what happened.
Adding Radix \+ Nova edited my globals.css file, including changing the background and foreground colors, as well as
adding a ton of useless color variables. I'll keep the extra color vars since I'm guessing my component library I added
uses them, but I'm gonna want to tweak those color variables to match my color scheme, which could take a while since
there's a *LOT* of new color vars. Okay, I give in, I'm using AI to adjust these colors to match my color scheme.

Now that that's taken care of, let's view the website so far. It's just some test stuff that will be removed shortly.
I've included a zoomable image that I've slightly modified from Kibo-UI's version, and text of 2 font families and sizes.
![Screenshot of the website test so far](/readme-assets/test_screenshot.png)

You may notice I have two cursors in this screenshot. That's quite unusual. I actually am working on a program that 
gives you 2 cursors controlled by 2 physical mice. It only works on Linux with Wayland though. My next blog post will
likely be about that. It's pretty useless, but fun to mess around with. Imagine using this in public. People would be so
confused.

Time to add a home page. I sketched out a rough layout for the website and the home page. It'll have an About Me section,
Recent Posts carousel, and a section displaying 3 of my other primary websites (zytronium.dev, satire.zytronium.dev,
and webworks.zytronium.dev). I'll also add a section for some of my social media links. 

I've finished my about me section, but with only basic styling, it doesn't look great.
![Screenshot of the website home page](/readme-assets/unstyled_home_page.png)

Before I move on, I should add some styling to make this look premium. Unforunately, I gave in to AI and had some
assistance styling the page, however, I think it turned out quite well after a bit of tweaking.
![Screenshot of the website home page with styling](/readme-assets/styled_home_page.png)

Before I can add the "Recent Posts" section of my website, I need to actually allow for the creation of posts and add a
place to browse posts. I also plan to add "notes," which are quick updates I write every now and then instead of full
posts.

---

It is now the next day. I made a lot less progress yesterday than expected. I've put together some progress goals for
the next few days that seem reasonable assuming I work on this every day, which I probably won't. I'll paste those goals
in a new file, [GOALS.md](GOALS.md).
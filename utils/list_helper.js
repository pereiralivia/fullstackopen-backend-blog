const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, curr) => (acc += curr.likes), 0);
};

const favoriteBlog = (blogs) => {
  const blogsSortedByLikes = blogs.sort((a, b) => b.likes - a.likes);

  const blogWithMaxLikes = blogsSortedByLikes[0];
  delete blogWithMaxLikes._id;
  delete blogWithMaxLikes.__v;
  delete blogWithMaxLikes.url;

  return blogWithMaxLikes;
};

const mostBlogs = (blogs) => {
  const blogsPerAuthor = blogs.reduce((blogsPerAuthorsArray, blog) => {
    const isAuthorInArray = blogsPerAuthorsArray.some(
      (a) => a.author === blog.author
    );

    if (blogsPerAuthorsArray.length === 0 || !isAuthorInArray) {
      return [...blogsPerAuthorsArray, { author: blog.author, blogs: 1 }];
    }

    return blogsPerAuthorsArray.map((blogsPerAuthorObject) => {
      if (blogsPerAuthorObject.author === blog.author) {
        blogsPerAuthorObject.blogs++;
        return blogsPerAuthorObject;
      }
      return blogsPerAuthorObject;
    });
  }, []);

  const authorsSortedByNumberOfBlog = blogsPerAuthor.sort(
    (a, b) => b.blogs - a.blogs
  );
  const authorWithMostBlogs = authorsSortedByNumberOfBlog[0];
  return authorWithMostBlogs;
};

const mostLikes = (blogs) => {
  const likesPerAuthor = blogs.reduce((likesPerAuthorsArray, blog) => {
    const isAuthorInArray = likesPerAuthorsArray.some(
      (a) => a.author === blog.author
    );

    if (likesPerAuthorsArray.length === 0 || !isAuthorInArray) {
      return [
        ...likesPerAuthorsArray,
        { author: blog.author, likes: blog.likes },
      ];
    }

    return likesPerAuthorsArray.map((blogsPerAuthorObject) => {
      if (blogsPerAuthorObject.author === blog.author) {
        blogsPerAuthorObject.likes += blog.likes;
        return blogsPerAuthorObject;
      }
      return blogsPerAuthorObject;
    });
  }, []);

  const authorsSortedByNumberOfLikes = likesPerAuthor.sort(
    (a, b) => b.likes - a.likes
  );
  const authorWithMostLikes = authorsSortedByNumberOfLikes[0];
  return authorWithMostLikes;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};


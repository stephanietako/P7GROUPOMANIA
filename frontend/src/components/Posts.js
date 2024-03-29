import React from 'react';
import Card from './Card';
import '../styles/Posts.css';

const Posts = ({ allPosts, update, setUpdate }) => {
  return (
    <div className="posts_section">
      <h2 className="posts_title">News Feed</h2>
      {allPosts.map((post, index) => {
        return (
          <Card
            key={`POST-${post.id}-${index}`}
            post={post}
            update={update}
            setUpdate={setUpdate}
          />
        );
      })}
    </div>
  );
};

export default Posts;
